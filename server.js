

// Define a GET route to serve the index.html
app.get('/', (req, res) => {

    res.sendFile(path.join(__dirname, 'log-in.html'));
});

//login request
app.post('/isregister', (req, res) => {
    const { EmployeeId, password } = req.body;
    // Check if the submitted data exists in the database
    db.query('SELECT * FROM user WHERE EmployeeId =  ? AND password = ?', [EmployeeId, password], (err, results) => {
        if (err) {
            console.log(err);
            throw err;
        }
        if (results.length > 0) {
            // Check if the user role is admin
            db.query('SELECT * FROM user WHERE EmployeeId = ? AND role = "admin"',[EmployeeId], (err, adminResult) => {
                if (err) {
                    console.log(err);
                    throw err;
                }
                if (adminResult.length > 0) {
                    // If user is admin, redirect to all-emp.html
                    res.redirect("index.html");
                } else {
                    // If user is not admin, redirect to inde.html
                    res.redirect("member.html");
                }
            });
        } else {
            // If the user doesn't exist, handle accordingly (e.g., show an error message)
            res.send('User not found');
        }
    });
});


//sign up request
app.post('/register', (req, res) => {
    console.log(req.body);
    const { EmployeeId, name, password } = req.body;
    db.query('SELECT * FROM employees WHERE EmployeeId =  ?', [EmployeeId], (err, results) => {
        if (err) {
            console.log(err);
            throw err;
        }
        if (results.length > 0) {
            const sql = `INSERT INTO user (EmployeeId, name, password) VALUES (?, ?, ?)`;
            
            db.query(sql, [EmployeeId, name, password], (err, newresult) => {
                if (err) {
                    console.error('Error inserting data:', err);
                    res.status(500).send('Failed to register user');
                    return;
                }
                //res.status(201).send('User registered successfully');
                res.redirect("log-in.html")
            });
        } 
        else {
            // If the user doesn't exist, handle accordingly (e.g., show an error message)
            res.send('User not found');
        }
    })
});

// POST endpoint for adding a new employee
app.post('/emppost', (req, res) => {
    console.log(req.body);
    const {EmployeeID,FirstName,LastName,Phone,Email,HireDate,Designation } = req.body;
debugger
    const sql = `INSERT INTO employees (EmployeeID, FirstName, LastName, Phone, Email, HireDate, Designation) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    
    db.query(sql, [EmployeeID, FirstName, LastName, Phone, Email, HireDate, Designation], (err, result) => {
        if (err) {
            console.error('Error inserting data:', err);
            res.status(500).send('Failed to add employee');
            return;
        }
        console.log('Employee added successfully');
        res.status(201).send('Employee added successfully');
    });
});

app.post('/addBonus', (req, res) => {
    console.log(req.body);
    const { BonusId, EmployeeID, BonusDate, BonusAmount, BonusReason } = req.body;

    const sql = `INSERT INTO bonuses (BonusId, EmployeeId, BonusDate, BonusAmount, BonusReason) VALUES (?, ?, ?, ?, ?)`;

    db.query(sql, [BonusId, EmployeeID, BonusDate, BonusAmount, BonusReason], (err, result) => {
        if (err) {
            console.error('Error inserting bonus data:', err);
            res.status(500).send('Failed to add bonus');
            return;
        }
        console.log('Bonus added successfully');
        res.status(201).send('Bonus added successfully');
    });
});


app.post('/addBenefit', (req, res) => {
    console.log(req.body);
    const { BenefitId, EmployeeID, BenefitType, BenefitAmount, BenefitDate, Provider } = req.body;

    const sql = `INSERT INTO benefits (BenefitId, EmployeeID, BenefitType, BenefitAmount, BenefitDate, Provider) VALUES (?, ?, ?, ?, ?, ?)`;

    db.query(sql, [BenefitId, EmployeeID, BenefitType, BenefitAmount, BenefitDate, Provider], (err, result) => {
        if (err) {
            console.error('Error inserting benefit data:', err);
            res.status(500).send('Failed to add benefit');
            return;
        }
        console.log('Benefit added successfully');
        res.status(201).send('Benefit added successfully');
    });
});


// app.post('/addAttendance', (req, res) => {
//     const { EmployeeID, AttendanceDate, Status } = req.body;

//     // Insert attendance record for the employee
//     const insertAttendanceQuery = `
//         INSERT INTO Attendance (EmployeeID, AttendanceDate, Status)
//         VALUES (?, ?, ?)
//     `;
//     db.query(insertAttendanceQuery, [EmployeeID, AttendanceDate, Status], (err, result) => {
//         if (err) {
//             console.error('Error inserting attendance record:', err);
//             res.status(500).json({ error: 'Failed to add attendance record' });
//             return;
//         }
//         console.log('Attendance record added successfully');
//         res.status(201).json({ message: 'Attendance record added successfully' });
//     });
// });

app.post('/addDeduction', (req, res) => {
    console.log(req.body);
    const { DeductionId, EmployeeID, DeductionType, DeductionAmount, DeductedDate } = req.body;

    const sql = INSERT INTO deductions (DeductionId, EmployeeID, DeductionType, DeductionAmount, DeductedDate) VALUES (?, ?, ?, ?, ?);

    db.query(sql, [DeductionId, EmployeeID, DeductionType, DeductionAmount, DeductedDate], (err, result) => {
        if (err) {
            console.error('Error inserting deduction data:', err);
            res.status(500).send('Failed to add deduction');
            return;
        }
        console.log('Deduction added successfully');
        res.status(201).send('Deduction added successfully');
    });
});



app.post('/addAttendance', (req, res) => {
    const { EmployeeID, AttendanceDate, Status } = req.body;

    // Insert attendance record for the employee
    const insertAttendanceQuery = `
        INSERT INTO Attendance (EmployeeID, AttendanceDate, Status)
        VALUES (?, ?, ?)
    `;

    db.query(insertAttendanceQuery, [EmployeeID, AttendanceDate, Status], (err, result) => {
        if (err) {
            console.error('Error inserting attendance record:', err);
            res.status(500).json({ error: 'Failed to add attendance record' });
            return;
        }

        console.log('Attendance record added successfully');

        // Check the count of absences
        const countAbsencesQuery = `
            SELECT COUNT(*) AS AbsenceCount
            FROM Attendance
            WHERE EmployeeID = ? AND Status = 'Absent'
        `;

        db.query(countAbsencesQuery, [EmployeeID], (err, rows) => {
            if (err) {
                console.error('Error counting absences:', err);
                res.status(500).json({ error: 'Failed to count absences' });
                return;
            }

            const absenceCount = rows[0].AbsenceCount;

            if (absenceCount > 3) {
                const currDate = new Date().toISOString().split('T')[0]; // Current date in YYYY-MM-DD format
                const deductionAmount = (absenceCount - 3) * 10; // Assuming each extra absence incurs a deduction of 10 units
                const insertDeductionQuery = `
                    INSERT INTO deductions (EmployeeID, DeductionType, DeductionAmount, DeductedDate)
                    VALUES (?, 'Short Attendance', ?, ?)
                `;

                db.query(insertDeductionQuery, [EmployeeID, deductionAmount, currDate], (err, result) => {
                    if (err) {
                        console.error('Error inserting deduction record:', err);
                        res.status(500).json({ error: 'Failed to add deduction record' });
                        return;
                    }

                    console.log('Deduction record added successfully due to short attendance');
                    res.status(201).json({ message: 'Attendance record added successfully and deduction applied due to short attendance' });
                });
            } else {
                res.status(201).json({ message: 'Attendance record added successfully' });
            }
        });
    });
});












app.post('/addTax', (req, res) => {
    const { TaxID, EmployeeID, WithholdingTax, SocialSecurityTax, OtherTax, OtherTaxDescription, TaxYear, TaxMonth } = req.body;

    // Queries to fetch the necessary components from respective tables
    const fetchPayrollQuery = `SELECT BasicSalary, OvertimeHours FROM payroll WHERE EmployeeID = ?`;
    const fetchBonusQuery = `SELECT BonusAmount as BonusAmount FROM bonuses WHERE EmployeeID = ?`;
    const fetchBenefitQuery = `SELECT BenefitAmount as BenefitAmount FROM benefits WHERE EmployeeID = ?`;
    const fetchDeductionQuery = `SELECT DeductionAmount as DeductionAmount FROM deductions WHERE EmployeeID = ?`;

    // Execute all queries in parallel
    db.query(fetchPayrollQuery, [EmployeeID], (err, payrollResults) => {
        if (err) {
            console.error('Error fetching payroll data:', err);
            res.status(500).json({ error: 'Failed to fetch payroll data' });
            return;
        }

        if (payrollResults.length === 0) {
            res.status(404).json({ error: 'No payroll data found for the given EmployeeID' });
            return;
        }

        db.query(fetchBonusQuery, [EmployeeID], (err, bonusResults) => {
            if (err) {
                console.error('Error fetching bonus data:', err);
                res.status(500).json({ error: 'Failed to fetch bonus data' });
                return;
            }

            db.query(fetchBenefitQuery, [EmployeeID], (err, benefitResults) => {
                if (err) {
                    console.error('Error fetching benefit data:', err);
                    res.status(500).json({ error: 'Failed to fetch benefit data' });
                    return;
                }

                db.query(fetchDeductionQuery, [EmployeeID], (err, deductionResults) => {
                    if (err) {
                        console.error('Error fetching deduction data:', err);
                        res.status(500).json({ error: 'Failed to fetch deduction data' });
                        return;
                    }

                    const payroll = payrollResults[0];
                    const bonus = bonusResults.length > 0 ? bonusResults[0].BonusAmount : 0;
                    const benefit = benefitResults.length > 0 ? benefitResults[0].BenefitAmount : 0;
                    const deduction = deductionResults.length > 0 ? deductionResults[0].DeductionAmount : 0;

                    const totalSalary = payroll.BasicSalary + (payroll.OvertimeHours * 100) + bonus + benefit - deduction;
                            console.log("TS: ".totalSalary);
                    let IncomeTax;
                    if (totalSalary > 200000) {
                        IncomeTax = totalSalary * 0.07;
                    } else if (totalSalary > 100000) {
                        IncomeTax = totalSalary * 0.05;
                    } else {
                        IncomeTax = totalSalary * 0.025;
                    }

                    // Calculate WithholdingTax, SocialSecurityTax, and OtherTax based on percentages of totalSalary
                    const withholdingTaxAmount = (totalSalary * WithholdingTax) / 100;
                    const socialSecurityTaxAmount = (totalSalary * SocialSecurityTax) / 100;
                    const otherTaxAmount = (totalSalary * OtherTax) / 100;

                    // Calculate TaxAmount by summing up all tax components
                    const TaxAmount = IncomeTax + withholdingTaxAmount + socialSecurityTaxAmount + otherTaxAmount;

                    // Insert tax record for the employee
                    const insertTaxQuery = `
                        INSERT INTO employeetax (TaxID, EmployeeID, IncomeTax, WithholdingTax, SocialSecurityTax, OtherTax, OtherTaxDescription, TaxYear, TaxMonth, TaxAmount)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    `;

                    db.query(insertTaxQuery, [TaxID, EmployeeID, IncomeTax, withholdingTaxAmount, socialSecurityTaxAmount, otherTaxAmount, OtherTaxDescription, TaxYear, TaxMonth, TaxAmount], (err, result) => {
                        if (err) {
                            console.error('Error inserting tax record:', err);
                            res.status(500).json({ error: 'Failed to add tax record' });
                            return;
                        }

                        console.log('Tax record added successfully');
                        res.status(201).json({ message: 'Tax record added successfully' });
                    });
                });
            });
        });
    });
});


app.get('/deductions', (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const sql = `
        SELECT 
            EmployeeID, 
            DeductionType,
            DeductionAmount,
            DATE_FORMAT(DeductedDate, '%m/%d/%Y') AS DeductedDate
        FROM Deductions
        LIMIT ?, ?`;

    db.query(sql, [offset, limit], (err, results) => {
        if (err) {
            console.error('Error fetching deductions:', err);
            res.status(500).send('Failed to fetch deductions');
            return;
        }
        res.json(results);
    });
});


// API endpoint to fetch attendance records based on employee ID
app.get('/attendance', (req, res) => {
    const { EmployeeID } = req.query;

    // Fetch attendance records from the database based on the employee ID
    const sql = `SELECT EmployeeID, DATE_FORMAT(AttendanceDate, '%m/%d/%Y') as AttendanceDate, Status FROM Attendance WHERE EmployeeID = ?`;
    db.query(sql, [EmployeeID], (err, results) => {
        if (err) {
            console.error('Error fetching attendance records:', err);
            res.status(500).json({ error: 'Failed to fetch attendance records' });
            return;
        }
        // Send the attendance records as JSON response
        res.json(results);
    });
});


app.post('/resetAttendance', (req, res) => {
    const currentDate = new Date();
    const dayOfMonth = currentDate.getDate();
    if (dayOfMonth === 16) {
        // Reset the attendance data in the database
        const sql = 'DELETE FROM Attendance';
        db.query(sql, (err, result) => {
            if (err) {
                console.error('Error resetting attendance data:', err);
                res.status(500).json({ error: 'Failed to reset attendance data' });
                return;
            }
            // Send success response
            res.status(200).json({ message: 'Attendance data reset successfully!' });
        });
    } else {
        res.status(400).json({ error: 'Attendance data can only be reset on the 1st of the month' });
    }
});




app.get('/bonuses', (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const sql = `
        SELECT 
            EmployeeID, 
            DATE_FORMAT(BonusDate, '%m/%d/%Y') AS BonusDate,
            BonusAmount,
            BonusReason
        FROM bonuses
        LIMIT ?, ?`;

    db.query(sql, [offset, limit], (err, results) => {
        if (err) {
            console.error('Error fetching bonuses:', err);
            res.status(500).send('Failed to fetch bonuses');
            return;
        }
        res.json(results);
    });
});


app.get('/benefits', (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const sql = `
        SELECT 
            EmployeeID,
            BenefitType,
            BenefitAmount,
            DATE_FORMAT(BenefitDate, '%m/%d/%Y') AS BenefitDate,
            Provider
        FROM benefits
        LIMIT ?, ?`;

    db.query(sql, [offset, limit], (err, results) => {
        if (err) {
            console.error('Error fetching benefits:', err);
            res.status(500).send('Failed to fetch benefits');
            return;
        }
        res.json(results);
    });
});















app.get('/attendance/present/:employeeID', (req, res) => {
    const employeeID = req.params.employeeID;
  
    // SQL query to calculate total present count and get the date of the last present for the provided employee ID
    const sql = `
      SELECT 
        COUNT(*) AS totalPresent,
        DATE_FORMAT(MAX(AttendanceDate), '%m/%d/%Y') AS lastPresentDate 
      FROM 
        attendance 
      WHERE 
        EmployeeID = ? AND 
        Status = 'Present' AND 
        MONTH(AttendanceDate) = MONTH(CURRENT_DATE()) AND 
        DAY(AttendanceDate) <= DAY(CURRENT_DATE())
    `;
  
    // Execute the SQL query with the provided employee ID
    db.query(sql, [employeeID], (err, result) => {
      if (err) {
        console.error('Error executing SQL query:', err);
        res.status(500).json({ error: 'Database query failed' });
        return;
      }
  
      // Send the calculated present data as JSON response
      res.json(result[0]);
    });
  });
  

//   app.get('/attendance/absent/:employeeID', (req, res) => {

//     const employeeID = req.params.employeeID;
  
//     // SQL query to calculate total absent count and get the date of the last absent for the provided employee ID
//     const sql = `
//       SELECT 
//         COUNT(*) AS totalAbsent,
//         DATE_FORMAT(MAX(AttendanceDate), '%m/%d/%Y') AS lastAbsentDate 
//       FROM 
//         attendance 
//       WHERE 
//         EmployeeID = ? AND 
//         Status = 'Absent' AND 
//         MONTH(AttendanceDate) = MONTH(CURRENT_DATE()) AND 
//         DAY(AttendanceDate) <= DAY(CURRENT_DATE())
//     `;
  
//     // Execute the SQL query with the provided employee ID
//     db.query(sql, [employeeID], (err, result) => {
//       if (err) {
//         console.error('Error executing SQL query:', err);
//         res.status(500).json({ error: 'Database query failed' });
//         return;
//       }
  
//       // Send the calculated absent data as JSON response
//       res.json(result[0]);
//     });
//   });
// Start the Express server





app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});





app.post('/addLeave', (req, res) => {
    console.log(req.body);
    const { EmployeeID, LeaveID, StartDate, LeaveType } = req.body;

    const sql = `INSERT INTO employeeleave (EmployeeID, LeaveID, StartDate, LeaveType) VALUES (?, ?, ?, ?)`;

    db.query(sql, [EmployeeID, LeaveID, StartDate, LeaveType], (err, result) => {
        if (err) {
            console.error('Error inserting leave data:', err);
            res.status(500).send('Failed to add leave');
            return;
        }
        console.log('Leave added successfully');
        res.status(201).send('Leave added successfully');
    });
});





  app.get('/employee/leave/:employeeID', (req, res) => {
    const employeeID = req.params.employeeID;
  
    // SQL query to calculate total leave taken and get details of the last leave taken for the provided employee ID
    const sql = `
      SELECT 
        COUNT(*) AS totalLeaveTaken,
        DATE_FORMAT(MAX(StartDate), '%m/%d/%Y') AS lastLeaveTakenDate,
        SUM(LeaveDuration) AS lastLeaveDuration
      FROM 
        employeeleave 
      WHERE 
        EmployeeID = ?
    `;
  
    // Execute the SQL query with the provided employee ID
    db.query(sql, [employeeID], (err, result) => {
      if (err) {
        console.error('Error executing SQL query:', err);
        res.status(500).json({ error: 'Database query failed' });
        return;
      }
  
      // Send the calculated leave data as JSON response
      res.json(result[0]);
    });
});

app.get('/employee/time-tracking/:employeeID', (req, res) => {
    const employeeID = req.params.employeeID;
  
    // SQL query to fetch time tracking data for the provided employee ID
    const sql = `
      SELECT 
        InTime,
        OutTime,
        HourWorked 
      FROM 
        timetracking 
      WHERE 
        EmployeeID = ? AND 
        WorkDate = CURDATE()
    `;
  
    // Execute the SQL query with the provided employee ID
    db.query(sql, [employeeID], (err, result) => {
      if (err) {
        console.error('Error executing SQL query:', err);
        res.status(500).json({ error: 'Database query failed' });
        return;
      }
  
      // Send the time tracking data as JSON response
      res.json(result[0]);
    });
});



// app.get('/employee/bonus/:employeeID', (req, res) => {
//     const employeeID = req.params.employeeID;

//     // SQL query to fetch bonus amount and reason for the provided employee ID
//     const sql = `
//       SELECT 
//         BonusAmount,
//         BonusReason
//       FROM 
//         bonuses 
//       WHERE 
//         EmployeeID = ?
//     `;

//     // Execute the SQL query with the provided employee ID
//     db.query(sql, [employeeID], (err, result) => {
//         if (err) {
//             console.error('Error executing SQL query:', err);
//             res.status(500).json({ error: 'Database query failed' });
//             return;
//         }

//         // Send the bonus data as JSON response
//         res.json(result[0]);
//     });
// });

app.get('/employee/bonus/:employeeID', (req, res) => {
    const employeeID = req.params.employeeID;

    // SQL query to fetch the sum of bonus amounts and the reasons for the provided employee ID
    const sql = `
      SELECT 
        SUM(BonusAmount) AS BonusAmount,
        GROUP_CONCAT(BonusReason SEPARATOR ', ') AS BonusReason
      FROM 
        bonuses 
      WHERE 
        EmployeeID = ?
      GROUP BY 
        EmployeeID
    `;

    // Execute the SQL query with the provided employee ID
    db.query(sql, [employeeID], (err, result) => {
        if (err) {
            console.error('Error executing SQL query:', err);
            res.status(500).json({ error: 'Database query failed' });
            return;
        }

        // Send the bonus data as JSON response
        res.json(result[0] || { TotalBonusAmount: 0, BonusReasons: '' });
    });
});









app.get('/employee/deduction/:employeeID', (req, res) => {
    const employeeID = req.params.employeeID;

    // SQL query to fetch the sum of deduction amounts and the types for the provided employee ID
    const sql = `
      SELECT 
        SUM(DeductionAmount) AS DeductionAmount,
        GROUP_CONCAT(DeductionType SEPARATOR ', ') AS DeductionType
      FROM 
        deductions 
      WHERE 
        EmployeeID = ?
      GROUP BY 
        EmployeeID
    `;

    // Execute the SQL query with the provided employee ID
    db.query(sql, [employeeID], (err, result) => {
        if (err) {
            console.error('Error executing SQL query:', err);
            res.status(500).json({ error: 'Database query failed' });
            return;
        }

        // Send the deduction data as JSON response
        res.json(result[0] || { TotalDeductionAmount: 0, DeductionTypes: '' });
    });
});

app.get('/employee/benefit/:employeeID', (req, res) => {
    const employeeID = req.params.employeeID;

    // SQL query to fetch the sum of benefit amounts and the types for the provided employee ID
    const sql = `
      SELECT 
        SUM(BenefitAmount) AS BenefitAmount,
        GROUP_CONCAT(BenefitType SEPARATOR ', ') AS BenefitType
      FROM 
        benefits 
      WHERE 
        EmployeeID = ?
      GROUP BY 
        EmployeeID
    `;

    // Execute the SQL query with the provided employee ID
    db.query(sql, [employeeID], (err, result) => {
        if (err) {
            console.error('Error executing SQL query:', err);
            res.status(500).json({ error: 'Database query failed' });
            return;
        }

        // Send the benefit data as JSON response
        res.json(result[0] || { TotalBenefitAmount: 0, BenefitTypes: '' });
    });
});













app.get('/employee/taxes/:employeeID', (req, res) => {
    const employeeID = req.params.employeeID;
  
    // SQL query to get tax-related information for the provided employee ID
    const sql = `
      SELECT 
        IncomeTax,
        WithholdingTax,
        SocialSecurityTax,
        OtherTax,
        OtherTaxDescription,
        TaxYear,
        TaxMonth,
        TaxAmount
      FROM 
      employeetax
      WHERE 
        EmployeeID = ?
      ORDER BY TaxYear DESC, TaxMonth DESC
      LIMIT 1
    `;
  
    // Execute the SQL query with the provided employee ID
    db.query(sql, [employeeID], (err, result) => {
        if (err) {
            console.error('Error executing SQL query:', err);
            res.status(500).json({ error: 'Database query failed' });
            return;
        }
  
        // Send the tax-related information as JSON response
        if (result.length > 0) {
            const taxInfo = result[0];
            res.json({
                incomeTax: taxInfo.IncomeTax,
                withholdingTax: taxInfo.WithholdingTax,
                socialSecurityTax: taxInfo.SocialSecurityTax,
                otherTax: taxInfo.OtherTax,
                otherTaxDescription: taxInfo.OtherTaxDescription,
                taxYear: taxInfo.TaxYear,
                taxMonth: taxInfo.TaxMonth,
                taxAmount: taxInfo.TaxAmount
            });
        } else {
            res.json({
                incomeTax: null,
                withholdingTax: null,
                socialSecurityTax: null,
                otherTax: null,
                otherTaxDescription: null,
                taxYear: null,
                taxMonth: null,
                taxAmount: null
            });
        }
    });
});









app.get('/employee/monthly-time/:employeeID', (req, res) => {
    const employeeID = req.params.employeeID;
    
    // SQL query to calculate total worked time, overtime, and shortage time
    const sql = `
      SELECT 
        SUM(HourWorked) AS totalWorkedTime,
        SUM(CASE WHEN HourWorked > 8 THEN HourWorked - 8 ELSE 0 END) AS totalOvertime,
        SUM(CASE WHEN HourWorked < 8 THEN 8 - HourWorked ELSE 0 END) AS totalShortageTime
      FROM 
        timetracking
      WHERE 
        EmployeeID = ? AND 
        MONTH(WorkDate) = MONTH(CURRENT_DATE()) AND 
        YEAR(WorkDate) = YEAR(CURRENT_DATE())
    `;
    
    // Execute the SQL query with the provided employee ID
    db.query(sql, [employeeID], (err, result) => {
      if (err) {
        console.error('Error executing SQL query:', err);
        res.status(500).json({ error: 'Database query failed' });
        return;
      }
  
      // Send the calculated data as JSON response
      res.json({
        WorkedTime: result[0].totalWorkedTime || 0,
        Overtime: result[0].totalOvertime || 0,
        ShortageTime: result[0].totalShortageTime || 0
      });
    });
  });
  
  app.get('/departments', (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const sql = `
        SELECT 
            d.DepartmentID,
            d.DepartmentName,
            d.HeadOfDepartment,
            COUNT(e.EmployeeID) AS TotalEmployees
        FROM department d
        LEFT JOIN employees e ON d.DepartmentID = e.DepartmentID
        GROUP BY d.DepartmentID, d.DepartmentName, d.HeadOfDepartment
        LIMIT ?, ?`;

    db.query(sql, [offset, limit], (err, results) => {
        if (err) {
            console.error('Error fetching departments:', err);
            res.status(500).send('Failed to fetch departments');
            return;
        }
        res.json(results);
    });
});



app.post('/departments', (req, res) => {
    console.log(req.body);
    const { DepartmentID, DepartmentName, HeadOfDepartment } = req.body;

    const sql = `INSERT INTO department (DepartmentID, DepartmentName, HeadOfDepartment) VALUES (?, ?, ?)`;

    db.query(sql, [DepartmentID, DepartmentName, HeadOfDepartment], (err, result) => {
        if (err) {
            console.error('Error inserting department:', err);
            res.status(500).send('Failed to add department');
            return;
        }
        console.log('Department added successfully');
        res.status(201).send('Department added successfully');
    });
});




app.get('/employeeleave', (req, res) => {
    const sql = `
        SELECT 
            EmployeeID,
            LeaveID,
             DATE_FORMAT(StartDate, '%m/%d/%Y') AS StartDate,
            DATE_FORMAT(EndDate, '%m/%d/%Y') AS EndDate,
            LeaveType,
            LeaveDuration
        FROM employeeleave`;

    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching employee leave data:', err);
            res.status(500).send('Failed to fetch employee leave data');
            return;
        }
        res.json(results);
    });
});
