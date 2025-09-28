const { sql, connectDB } = require('../configs/database');

// Tạo sinh viên.
async function createStudent({ fullName, email, phone = null, tuitionCode = null }) {
  const pool = await connectDB();
  try {
    const r = await pool.request()
      .input('fullName', sql.NVarChar(100), String(fullName).trim())
      .input('email',    sql.VarChar(255),  String(email).trim())
      .input('phone',    sql.VarChar(20),   phone ?? null)
      .input('code',     sql.VarChar(50),   tuitionCode ?? null)
      .query(`
        INSERT INTO dbo.Student (StudentFullName, StudentEmail, StudentPhone, StudentTuitionCode)
        VALUES (@fullName, @email, @phone, @code);
        SELECT SCOPE_IDENTITY() AS id;
      `);
    return { id: Number(r.recordset[0].id) };
  } catch (err) {
    console.error('[Student.create]', err);
    throw err;
  }
}

// Lấy 1 sinh viên theo StudentID 
async function getById(id) {
  const pool = await connectDB();
  try {
    const r = await pool.request()
      .input('id', sql.Int, Number(id))
      .query(`
        SELECT StudentID, StudentFullName, StudentEmail, StudentPhone, StudentTuitionCode
        FROM dbo.Student WHERE StudentID = @id;
      `);
    return r.recordset[0] || null;
  } catch (err) {
    console.error('[Student.getById]', err);
    throw err;
  }
}

// Lấy nhiều sinh viên theo danh sách StudentID
async function findByIds(ids = []) {
  const list = (ids || []).map(Number).filter(Number.isInteger);
  if (list.length === 0) return [];
  const pool = await connectDB();
  try {
    const placeholders = list.map((_, i) => `@id${i}`).join(',');
    const req = pool.request();
    list.forEach((v, i) => req.input(`id${i}`, sql.Int, v));
    const r = await req.query(`
      SELECT StudentID, StudentFullName, StudentEmail, StudentPhone, StudentTuitionCode
      FROM dbo.Student WHERE StudentID IN (${placeholders});
    `);
    return r.recordset;
  } catch (err) {
    console.error('[Student.findByIds]', err);
    throw err;
  }
}

// Lấy 1 sinh viên theo mã thanh toán 
async function getByTuitionCode(code) {
  const pool = await connectDB();
  try {
    const r = await pool.request()
      .input('code', sql.VarChar(50), String(code).trim())
      .query(`
        SELECT StudentID, StudentFullName, StudentEmail, StudentPhone, StudentTuitionCode
        FROM dbo.Student WHERE StudentTuitionCode = @code;
      `);
    return r.recordset[0] || null;
  } catch (err) {
    console.error('[Student.getByCode]', err);
    throw err;
  }
}

// Lấy nhiều sinh viên theo danh sách mã thanh toán 
async function findByTuitionCodes(codes = []) {
  const list = (codes || []).map(c => String(c || '').trim()).filter(Boolean);
  if (list.length === 0) return [];
  const pool = await connectDB();
  try {
    const placeholders = list.map((_, i) => `@c${i}`).join(',');
    const req = pool.request();
    list.forEach((v, i) => req.input(`c${i}`, sql.NVarChar(50), v));
    const r = await req.query(`
      SELECT StudentID, StudentFullName, StudentEmail, StudentPhone, StudentTuitionCode
      FROM dbo.Student WHERE StudentTuitionCode IN (${placeholders});
    `);
    return r.recordset;
  } catch (err) {
    console.error('[Student.findByCodes]', err);
    throw err;
  }
}

module.exports = {
  createStudent,
  getById,
  findByIds,
  getByTuitionCode,
  findByTuitionCodes,
};
