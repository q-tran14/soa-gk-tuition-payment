const Student = require('../models/Student');

// helper trả 400
function bad(res, msg) { return res.status(400).json({ error: msg }); }

// POST /api/students - tạo sinh viên 
async function Create(req, res) {
  try {
    const { fullName, email, phone, tuitionCode } = req.body || {};
    if (!fullName || !email) return bad(res, 'fullName & email are required');

    const out = await Student.createStudent({ fullName, email, phone, tuitionCode });
    return res.status(201).json({ id: out.id }); // trả về ID vừa tạo
  } catch (e) {
    console.error('[Student.Create]', e);
    const errNo = e?.originalError?.info?.number;
    // 2627/2601: trùng UNIQUE (email/code)
    if (errNo === 2627 || errNo === 2601) {
      return res.status(409).json({ error: 'duplicate_email_or_code' });
    }
    return res.status(500).json({ error: 'server_error' });
  }
}

// GET /api/students/:code - lấy theo mã thanh toán 
async function GetByCode(req, res) {
  try {
    const code = req.params.code?.trim();
    if (!code) return bad(res, 'code is required');

    const s = await Student.getByTuitionCode(code);
    if (!s) return res.status(404).json({ error: 'not_found' });
    return res.json(s);
  } catch (e) {
    console.error('[Student.GetByCode]', e);
    return res.status(500).json({ error: 'server_error' });
  }
}

// POST /api/students/lookup - lấy nhiều theo danh sách mã thanh toán 
async function Lookup(req, res) {
  try {
    const { codes } = req.body || {};
    if (!Array.isArray(codes) || codes.length === 0)
      return bad(res, 'codes must be a non-empty array');

    const rows = await Student.findByTuitionCodes(codes);
    return res.json(rows);
  } catch (e) {
    console.error('[Student.Lookup]', e);
    return res.status(500).json({ error: 'server_error' });
  }
}

// GET /api/students/id/:id - lấy theo StudentID (PK) 
async function GetById(req, res) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) return bad(res, 'id must be an integer');

    const s = await Student.getById(id);
    if (!s) return res.status(404).json({ error: 'not_found' });
    return res.json(s);
  } catch (e) {
    console.error('[Student.GetById]', e);
    return res.status(500).json({ error: 'server_error' });
  }
}

// POST /api/students/lookup-by-id - lấy nhiều theo danh sách StudentID 
async function LookupById(req, res) {
  try {
    const { ids } = req.body || {};
    if (!Array.isArray(ids) || ids.length === 0)
      return bad(res, 'ids must be a non-empty array');

    const parsed = ids.map(Number);
    if (!parsed.every(Number.isInteger))
      return bad(res, 'ids must be integers');

    const rows = await Student.findByIds(parsed);
    return res.json(rows);
  } catch (e) {
    console.error('[Student.LookupById]', e);
    return res.status(500).json({ error: 'server_error' });
  }
}

module.exports = {
  Create,
  GetByCode,
  Lookup,
  GetById,
  LookupById,
};
