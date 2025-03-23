import Payroll from "../schemas/payrollSchema.js";

export const totalExpesnes = async (req, res) => {
    try {
      const totalExpenses = await Payroll.aggregate([
        { $group: { _id: null, total: { $sum: "$netSalary" } } },
      ]);
  
      res.json({ totalPayrollExpenses: totalExpenses[0]?.total || 0 });
    } catch (error) {
      res
        .status(500)
        .json({
          error: "Error calculating total payroll expenses",
          details: error.message,
        });
    }
  }

  export const newPayroll = async (req, res) => {
    try {
      const {
        employeeId,
        name,
        role,
        salary,
        deductions = 0,
        allowances = 0,
        bonuses = 0,
        benefits,
        taxDetails,
        payrollBankDetails,
      } = req.body;
  
      const netSalary = salary + allowances + bonuses - deductions;
  
      const payroll = new Payroll({
        employeeId,
        name,
        role,
        salary,
        deductions,
        allowances,
        bonuses,
        netSalary,
        paymentDate: new Date(),
        status: "Pending",
        benefits,
        taxDetails,
        payrollBankDetails,
      });
  
      await payroll.save();
      res
        .status(201)
        .json({ message: "Payroll processed successfully", payroll });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Failed to process payroll", details: error.message });
    }
  }

  export const allPayrolls = async (req, res) => {
    try {
      const payrolls = await Payroll.find();
      res.json(payrolls);
    } catch (error) {
      res
        .status(500)
        .json({
          error: "Failed to fetch payroll records",
          details: error.message,
        });
    }
  }

  export const getPayroll = async (req, res) => {
    try {
      const { employeeId } = req.params;
      const payroll = await Payroll.findOne({ employeeId });
  
      if (!payroll) {
        return res.status(404).json({ error: "Payroll record not found" });
      }
  
      res.json(payroll);
    } catch (error) {
      res
        .status(500)
        .json({ error: "Error fetching payroll record", details: error.message });
    }
  }

  export const updatePayroll = async (req, res) => {
    try {
      const { id } = req.params;
      const {
        salary,
        deductions,
        allowances,
        bonuses,
        benefits,
        taxDetails,
        payrollBankDetails,
      } = req.body;
  
      const payroll = await Payroll.findById(id);
      if (!payroll) {
        return res.status(404).json({ error: "Payroll record not found" });
      }
  
      payroll.salary = salary ?? payroll.salary;
      payroll.deductions = deductions ?? payroll.deductions;
      payroll.allowances = allowances ?? payroll.allowances;
      payroll.bonuses = bonuses ?? payroll.bonuses;
      payroll.netSalary =
        payroll.salary +
        payroll.allowances +
        payroll.bonuses -
        payroll.deductions;
      payroll.benefits = benefits ?? payroll.benefits;
      payroll.taxDetails = taxDetails ?? payroll.taxDetails;
      payroll.payrollBankDetails =
        payrollBankDetails ?? payroll.payrollBankDetails;
  
      await payroll.save();
      res.json({ message: "Payroll record updated", payroll });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Error updating payroll record", details: error.message });
    }
  }

  export const deletePayroll = async (req, res) => {
    try {
      const { id } = req.params;
      const payroll = await Payroll.findByIdAndDelete(id);
  
      if (!payroll) {
        return res.status(404).json({ error: "Payroll record not found" });
      }
  
      res.json({ message: "Payroll record deleted", payroll });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Error deleting payroll record", details: error.message });
    }
  }

  export const markAsPaid = async (req, res) => {
    try {
      const { id } = req.params;
      const payroll = await Payroll.findById(id);
  
      if (!payroll) {
        return res.status(404).json({ error: "Payroll record not found" });
      }
  
      payroll.status = "Paid";
      payroll.paymentDate = new Date();
  
      await payroll.save();
      res.json({ message: "Payroll marked as Paid", payroll });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Error marking payroll as Paid", details: error.message });
    }
  }