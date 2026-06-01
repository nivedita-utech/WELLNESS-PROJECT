import BusinessControl from '../models/BusinessControl.js';
import Sale from '../models/Sale.js';
import User from '../models/User.js';
import Product from '../models/Product.js';

// @desc    Get business configuration settings
// @route   GET /api/business/control
// @access  Private (Admin only)
export const getBusinessControl = async (req, res) => {
  try {
    let control = await BusinessControl.findOne({});
    if (!control) {
      control = await BusinessControl.create({
        franchiseMode: true,
        salesAssignment: 'franchise',
        selfFranchiseRule: 'company',
        auditLogs: [],
      });
    }
    res.json(control);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update business config & log audit trail
// @route   POST /api/business/control
// @access  Private (Admin only)
export const updateBusinessControl = async (req, res) => {
  const { franchiseMode, salesAssignment, selfFranchiseRule } = req.body;

  try {
    let control = await BusinessControl.findOne({});
    if (!control) {
      control = new BusinessControl();
    }

    const logs = [];
    const changedBy = req.user._id;
    const changedByName = req.user.name;

    if (franchiseMode !== undefined && control.franchiseMode !== franchiseMode) {
      logs.push({
        changedBy,
        changedByName,
        changeDescription: `Toggled Franchise Mode from ${control.franchiseMode} to ${franchiseMode}`,
      });
      control.franchiseMode = franchiseMode;
    }

    if (salesAssignment !== undefined && control.salesAssignment !== salesAssignment) {
      logs.push({
        changedBy,
        changedByName,
        changeDescription: `Changed Sales Assignment target from ${control.salesAssignment} to ${salesAssignment}`,
      });
      control.salesAssignment = salesAssignment;
    }

    if (selfFranchiseRule !== undefined && control.selfFranchiseRule !== selfFranchiseRule) {
      logs.push({
        changedBy,
        changedByName,
        changeDescription: `Set Self-Franchise Rule from ${control.selfFranchiseRule} to ${selfFranchiseRule}`,
      });
      control.selfFranchiseRule = selfFranchiseRule;
    }

    if (logs.length > 0) {
      control.auditLogs.push(...logs);
      await control.save();
    }

    res.json(control);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get audit trail history
// @route   GET /api/business/audit-logs
// @access  Private (Admin only)
export const getAuditLogs = async (req, res) => {
  try {
    const control = await BusinessControl.findOne({});
    if (!control) {
      return res.json([]);
    }
    // Return sorted newest first
    const sortedLogs = [...control.auditLogs].sort((a, b) => b.timestamp - a.timestamp);
    res.json(sortedLogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Process a new membership sale / payment
// @route   POST /api/business/sale
// @access  Private
export const processSale = async (req, res) => {
  const { amount, clientEmail, description, manualAssignment } = req.body;

  if (typeof amount !== 'number' || amount <= 0) {
    return res.status(400).json({ message: 'Invalid amount. Amount must be greater than 0.' });
  }

  try {
    const client = await User.findOne({ email: clientEmail });
    if (!client) {
      return res.status(404).json({ message: 'Client not found with this email' });
    }

    let control = await BusinessControl.findOne({});
    if (!control) {
      control = await BusinessControl.create({});
    }

    // Determine Sale Routing
    let assignedTo = 'company';
    let franchiseId = client.franchiseId || null;

    // Check manual override (Self-Franchise Rule)
    if (manualAssignment && (req.user.role === 'admin')) {
      assignedTo = manualAssignment; // 'franchise' or 'company'
    } else {
      // Follow business configuration logic
      if (control.franchiseMode) {
        if (control.salesAssignment === 'franchise' && franchiseId) {
          assignedTo = 'franchise';
        } else {
          assignedTo = 'company';
        }
      } else {
        assignedTo = 'company';
      }
    }

    // Standard commission: 25% of sale value to Franchise if routed to Franchise
    let commissionAmount = 0;
    if (assignedTo === 'franchise') {
      commissionAmount = amount * 0.25; 
    }

    const sale = await Sale.create({
      amount,
      userId: client._id,
      franchiseId: assignedTo === 'franchise' ? franchiseId : null,
      assignedTo,
      commissionAmount,
      description,
    });

    res.status(201).json(sale);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get Sales history depending on Role
// @route   GET /api/business/sales
// @access  Private
export const getSales = async (req, res) => {
  try {
    let sales;
    if (req.user.role === 'admin') {
      // Admin sees everything
      sales = await Sale.find({})
        .populate('userId', 'name email membershipId')
        .populate('franchiseId', 'name email')
        .sort({ date: -1 });
    } else if (req.user.role === 'franchise') {
      // Franchise owner sees their branch sales
      sales = await Sale.find({ franchiseId: req.user._id })
        .populate('userId', 'name email membershipId')
        .sort({ date: -1 });
    } else {
      // Staff / User sees their own context
      sales = await Sale.find({ userId: req.user._id })
        .populate('userId', 'name email')
        .sort({ date: -1 });
    }
    res.json(sales);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get Franchises list
// @route   GET /api/business/franchises
// @access  Private (Admin only)
export const getFranchises = async (req, res) => {
  try {
    const franchises = await User.find({ role: 'franchise' }).select('name email status');
    res.json(franchises);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get Franchise dashboard aggregated revenue metrics
// @route   GET /api/business/franchise-dashboard/:franchiseId
// @access  Private
export const getFranchiseDashboardData = async (req, res) => {
  const franchiseId = req.params.franchiseId;

  // IDOR protection: Ensure franchise can only access their own dashboard
  if (req.user.role === 'franchise' && req.user._id.toString() !== franchiseId) {
    return res.status(403).json({ message: 'Forbidden. You can only view your own dashboard.' });
  }

  try {
    const sales = await Sale.find({ franchiseId, assignedTo: 'franchise' });
    const staff = await User.find({ role: 'staff', franchiseId }).select('name email status');
    const clients = await User.find({ role: 'user', franchiseId }).select('name email wellnessLevel points');

    const totalRevenue = sales.reduce((acc, sale) => acc + sale.amount, 0);
    const totalCommission = sales.reduce((acc, sale) => acc + sale.commissionAmount, 0);

    res.json({
      sales,
      staff,
      clients,
      totalRevenue,
      totalCommission,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ============================================================
// E-COMMERCE / SHOP (Products & Consultations)
// ============================================================

// @desc    Get all active products
// @route   GET /api/business/products
// @access  Private
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a product or consultation
// @route   POST /api/business/products
// @access  Private (Admin/Franchise)
export const createProduct = async (req, res) => {
  try {
    const { title, description, price, type, stock, imageUrl } = req.body;
    let franchiseId = null;
    
    // If franchise is creating it, tie it to their franchise
    if (req.user.role === 'franchise') {
      franchiseId = req.user._id;
    }

    const product = await Product.create({
      title,
      description,
      price,
      type,
      stock,
      imageUrl,
      franchiseId
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
