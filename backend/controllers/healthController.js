import BodyAnalysis from '../models/BodyAnalysis.js';
import MedicalReport from '../models/MedicalReport.js';
import HealthDocument from '../models/HealthDocument.js';
import User from '../models/User.js';

// Helper to determine Risk Indicator & Health Score
const calculateHealthMetrics = (bodyFat, bmi, sugar, bpSystolic, bpDiastolic, vitaminD) => {
  let riskPoints = 0;
  let score = 100;

  // BMI evaluation
  if (bmi < 18.5 || bmi >= 25) {
    riskPoints += 1;
    score -= 10;
  }
  if (bmi >= 30) {
    riskPoints += 2;
    score -= 15;
  }

  // Body Fat evaluation (rough average, ideal 12-24%)
  if (bodyFat < 10 || bodyFat > 25) {
    riskPoints += 1;
    score -= 10;
  }
  if (bodyFat > 32) {
    riskPoints += 2;
    score -= 15;
  }

  // Blood Sugar (mg/dL) - Fasting
  if (sugar > 100) {
    riskPoints += 1;
    score -= 10;
  }
  if (sugar > 126) {
    riskPoints += 2;
    score -= 20;
  }

  // Blood Pressure
  if (bpSystolic > 130 || bpDiastolic > 85) {
    riskPoints += 1;
    score -= 10;
  }
  if (bpSystolic > 140 || bpDiastolic > 90) {
    riskPoints += 2;
    score -= 15;
  }

  // Vitamin D (ng/mL)
  if (vitaminD && vitaminD < 30) {
    riskPoints += 1;
    score -= 5;
  }
  if (vitaminD && vitaminD < 20) {
    riskPoints += 2;
    score -= 10;
  }

  let risk = 'Green';
  if (riskPoints >= 4) {
    risk = 'Red';
  } else if (riskPoints >= 1) {
    risk = 'Yellow';
  }

  return { healthScore: Math.max(30, score), riskIndicator: risk };
};

// @desc    Record Body Analysis (Staff/Admin only)
// @route   POST /api/health/body-analysis
// @access  Private (Staff/Admin)
export const createBodyAnalysis = async (req, res) => {
  const { userId, weight, bodyFat, bmi, muscleMass, visceralFat, waterPercent, proteinPercent, metabolicAge, boneMass } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Default basic metrics for calculations
    const latestMedical = await MedicalReport.findOne({ userId }).sort({ date: -1 });
    const sugar = latestMedical ? latestMedical.sugar : 90;
    const bpSyst = latestMedical ? latestMedical.bpSystolic : 120;
    const bpDiast = latestMedical ? latestMedical.bpDiastolic : 80;

    const { healthScore, riskIndicator } = calculateHealthMetrics(bodyFat, bmi, sugar, bpSyst, bpDiast, 35);

    const analysis = await BodyAnalysis.create({
      userId,
      recordedBy: req.user._id,
      weight,
      bodyFat,
      bmi,
      muscleMass,
      visceralFat,
      waterPercent,
      proteinPercent,
      metabolicAge,
      boneMass,
      healthScore,
      riskIndicator,
    });

    res.status(201).json(analysis);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Record Medical Report (Staff/Admin only)
// @route   POST /api/health/medical-report
// @access  Private (Staff/Admin)
export const createMedicalReport = async (req, res) => {
  const {
    userId,
    sugar,
    bpSystolic,
    bpDiastolic,
    hemoglobin,
    cbc,
    lipidProfile,
    vitamins,
    thyroid,
    liverFunction,
    kidneyFunction,
    hormonalTests,
  } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Reference latest body analysis
    const latestAnalysis = await BodyAnalysis.findOne({ userId }).sort({ date: -1 });
    const bodyFat = latestAnalysis ? latestAnalysis.bodyFat : 18;
    const bmi = latestAnalysis ? latestAnalysis.bmi : 22;
    const vitD = vitamins ? vitamins.vitaminD : 35;

    const { healthScore, riskIndicator } = calculateHealthMetrics(bodyFat, bmi, sugar, bpSystolic, bpDiastolic, vitD);

    const report = await MedicalReport.create({
      userId,
      recordedBy: req.user._id,
      sugar,
      bpSystolic,
      bpDiastolic,
      hemoglobin,
      cbc,
      lipidProfile,
      vitamins,
      thyroid,
      liverFunction,
      kidneyFunction,
      hormonalTests,
      riskIndicator,
    });

    // Update latest body analysis health score & risk indicator if exists to keep synced
    if (latestAnalysis) {
      latestAnalysis.healthScore = healthScore;
      latestAnalysis.riskIndicator = riskIndicator;
      await latestAnalysis.save();
    }

    res.status(201).json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's Body Analysis logs
// @route   GET /api/health/body-analysis/:userId
// @access  Private
export const getBodyAnalysis = async (req, res) => {
  const userId = req.params.userId;
  try {
    const logs = await BodyAnalysis.find({ userId }).sort({ date: -1 });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's Medical Reports
// @route   GET /api/health/medical-report/:userId
// @access  Private
export const getMedicalReports = async (req, res) => {
  const userId = req.params.userId;
  try {
    const reports = await MedicalReport.find({ userId }).sort({ date: -1 });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Upload Health Documents
// @route   POST /api/health/upload-document
// @access  Private
export const uploadDocument = async (req, res) => {
  const { fileCategory, notes } = req.body;

  if (!req.file) {
    return res.status(400).json({ message: 'Please upload a file' });
  }

  try {
    const doc = await HealthDocument.create({
      userId: req.user._id,
      fileName: req.file.originalname,
      fileCategory: fileCategory || 'Other',
      filePath: `/uploads/${req.file.filename}`,
      notes,
    });

    res.status(201).json(doc);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's uploaded Health Documents
// @route   GET /api/health/documents/:userId
// @access  Private
export const getUploadedDocuments = async (req, res) => {
  const userId = req.params.userId;
  try {
    const docs = await HealthDocument.find({ userId }).sort({ uploadDate: -1 });
    res.json(docs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get AI comparison analytics reports
// @route   GET /api/health/ai-insights/:userId
// @access  Private
export const getAIInsights = async (req, res) => {
  const userId = req.params.userId;

  try {
    const bodyHistory = await BodyAnalysis.find({ userId }).sort({ date: 1 });
    const medicalHistory = await MedicalReport.find({ userId }).sort({ date: 1 });

    if (bodyHistory.length === 0 && medicalHistory.length === 0) {
      return res.json({
        comparisonAvailable: false,
        summary: 'No health or body logs exist. Complete your initial health profiling with a coach to generate intelligence reports.',
      });
    }

    const latestBody = bodyHistory[bodyHistory.length - 1];
    const previousBody = bodyHistory.length > 1 ? bodyHistory[bodyHistory.length - 2] : null;

    const latestMedical = medicalHistory[medicalHistory.length - 1];
    const previousMedical = medicalHistory.length > 1 ? medicalHistory[medicalHistory.length - 2] : null;

    let bodyFatDiff = 0;
    let weightDiff = 0;
    let bmiDiff = 0;
    let sugarDiff = 0;
    let bpDiffText = '';

    let insightsList = [];
    let recommendations = [];

    // Body fat logic
    if (latestBody) {
      if (previousBody) {
        bodyFatDiff = latestBody.bodyFat - previousBody.bodyFat;
        weightDiff = latestBody.weight - previousBody.weight;
        bmiDiff = latestBody.bmi - previousBody.bmi;

        const fatText = bodyFatDiff < 0 
          ? `Your Body Fat % decreased by ${Math.abs(bodyFatDiff).toFixed(1)}% (from ${previousBody.bodyFat}% to ${latestBody.bodyFat}%). Excellent fat-loss progression!` 
          : bodyFatDiff > 0 
            ? `Your Body Fat % increased by ${bodyFatDiff.toFixed(1)}% (from ${previousBody.bodyFat}% to ${latestBody.bodyFat}%). Consider adjusting your daily calorie intake.` 
            : `Your Body Fat % has stabilized at ${latestBody.bodyFat}%.`;
        insightsList.push(fatText);

        const weightText = weightDiff < 0 
          ? `Weight went down by ${Math.abs(weightDiff).toFixed(1)} kg. Total lean mass percentage changes suggest positive tissue rebuilding.` 
          : weightDiff > 0 
            ? `Weight gained by ${weightDiff.toFixed(1)} kg. Ensure your protein consumption matches your muscle hypertrophy program.` 
            : `Weight stabilized at ${latestBody.weight} kg.`;
        insightsList.push(weightText);
      } else {
        insightsList.push(`Initial body profile recorded: Weight ${latestBody.weight} kg, BMI ${latestBody.bmi}, Body Fat ${latestBody.bodyFat}%.`);
      }

      // Recommendations based on metrics
      if (latestBody.bmi >= 25) {
        recommendations.push('Maintain a calorie deficit of 300-500 kcal and focus on high-intensity interval training (HIIT).');
      } else if (latestBody.bmi < 18.5) {
        recommendations.push('Incorporate resistance training 3-4 days a week and increase complex carbohydrates and clean fats.');
      } else {
        recommendations.push('Keep up the maintenance program with balanced macro splits (40% Carbs, 30% Protein, 30% Fat).');
      }

      if (latestBody.visceralFat > 9) {
        recommendations.push('Reduce intake of processed sugars and alcohol to decrease visceral fat levels (currently elevated).');
      }
    }

    // Medical reports comparison logic
    if (latestMedical) {
      if (previousMedical) {
        sugarDiff = latestMedical.sugar - previousMedical.sugar;
        const sugarText = sugarDiff < 0 
          ? `Blood Sugar levels decreased by ${Math.abs(sugarDiff)} mg/dL, showing active glucose utilization and improved insulin sensitivity.` 
          : sugarDiff > 0 
            ? `Blood Sugar levels rose by ${sugarDiff} mg/dL. Monitor carbohydrate intake and daily step counts after meals.` 
            : `Blood Sugar levels remained stable at ${latestMedical.sugar} mg/dL.`;
        insightsList.push(sugarText);

        const bpText = `Blood Pressure transitioned from ${previousMedical.bpSystolic}/${previousMedical.bpDiastolic} mmHg to ${latestMedical.bpSystolic}/${latestMedical.bpDiastolic} mmHg.`;
        insightsList.push(bpText);
      } else {
        insightsList.push(`Initial medical profile recorded: Fasting Sugar ${latestMedical.sugar} mg/dL, Blood Pressure ${latestMedical.bpSystolic}/${latestMedical.bpDiastolic} mmHg.`);
      }

      // Recommendations based on medical levels
      if (latestMedical.sugar > 100) {
        recommendations.push('Increase dietary fiber (leafy greens, chia seeds) and ensure 30 minutes of brisk walking post-dinner.');
      }
      if (latestMedical.bpSystolic > 130) {
        recommendations.push('Implement stress management techniques (10-15 minutes of breathing exercises) and restrict sodium intake to < 2000mg/day.');
      }
      if (latestMedical.hemoglobin < 12) {
        recommendations.push('Consider iron-rich foods (spinach, beetroot, legumes) or organic iron supplementation under clinical oversight.');
      }
      if (latestMedical.vitamins?.vitaminD && latestMedical.vitamins.vitaminD < 30) {
        recommendations.push('Vitamin D level is low (${latestMedical.vitamins.vitaminD} ng/mL). Supplementation or safe sunlight exposure recommended.');
      }
    }

    // Overall assessment
    const activeScore = latestBody?.healthScore || latestMedical?.riskIndicator || 70;
    const activeRisk = latestBody?.riskIndicator || latestMedical?.riskIndicator || 'Green';

    res.json({
      comparisonAvailable: true,
      healthScore: activeScore,
      riskIndicator: activeRisk,
      insights: insightsList,
      recommendations: recommendations.length > 0 ? recommendations : ['Continue tracking daily parameters to build health trends.'],
      lastUpdated: latestBody?.date || latestMedical?.date || new Date(),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
