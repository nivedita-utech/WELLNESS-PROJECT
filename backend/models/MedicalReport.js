import mongoose from 'mongoose';

const medicalReportSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    recordedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    // Basic Medicals
    sugar: {
      type: Number, // mg/dL
      required: true,
    },
    bpSystolic: {
      type: Number, // mmHg
      required: true,
    },
    bpDiastolic: {
      type: Number, // mmHg
      required: true,
    },
    hemoglobin: {
      type: Number, // g/dL
      required: true,
    },
    // Advanced Medicals
    cbc: {
      wbc: Number,
      rbc: Number,
      platelets: Number,
    },
    lipidProfile: {
      cholesterol: Number,
      hdl: Number,
      ldl: Number,
      triglycerides: Number,
    },
    vitamins: {
      vitaminD: Number,
      vitaminB12: Number,
    },
    thyroid: {
      t3: Number,
      t4: Number,
      tsh: Number,
    },
    liverFunction: {
      sgot: Number,
      sgpt: Number,
      bilirubin: Number,
    },
    kidneyFunction: {
      urea: Number,
      creatinine: Number,
    },
    hormonalTests: {
      testosterone: Number,
      estrogen: Number,
    },
    riskIndicator: {
      type: String,
      enum: ['Green', 'Yellow', 'Red'],
      default: 'Green',
    },
  },
  {
    timestamps: true,
  }
);

const MedicalReport = mongoose.model('MedicalReport', medicalReportSchema);
export default MedicalReport;
