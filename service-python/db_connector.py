import pyodbc
from dotenv import load_dotenv
import os

# 1. Load cấu hình từ file .env
load_dotenv()

DB_DRIVER = os.getenv("DB_DRIVER")     # Ví dụ: {ODBC Driver 17 for SQL Server}
DB_SERVER = os.getenv("DB_SERVER")     # Tên server: localhost, . hoặc IP
DB_DATABASE = os.getenv("DB_DATABASE") # Tên database


# 2. Hàm Kết nối Database
def get_db_connection():
    #Tạo và trả về kết nối đến SQL Server
    try:
        conn_str = (
            f"DRIVER={DB_DRIVER};"
            f"SERVER={DB_SERVER};"
            f"DATABASE={DB_DATABASE};"
            f"Trusted_Connection=yes;" #Không cần nhập username/ password bên database
        )
        return pyodbc.connect(conn_str)
    except pyodbc.Error as e:
        print("Không thể kết nối database:", e)
        return None


# 3. Hàm SELECT (Lấy dữ liệu)
def getData(query: str, params: tuple = (), fetch_one: bool = False):
    """
    Thực thi SELECT query.
    - query: Câu lệnh SQL (SELECT)
    - params: Tham số truyền vào (tuple)
    - fetch_one: True nếu chỉ muốn lấy 1 bản ghi
    """
    conn = get_db_connection()
    if not conn:
        return None

    try:
        cursor = conn.cursor()
        cursor.execute(query, params)

        # Lấy tên các cột trong kết quả
        columns = [col[0] for col in cursor.description]

        #Lấy một bản ghi (dùng để tra từng tuition bằng tuitionID)
        if fetch_one:
            row = cursor.fetchone()
            if row:
                return dict(zip(columns, row))
            else: None

        #Lấy tất cả bản ghi (dùng để tra tất cả các tuition hiện có)
        rows = cursor.fetchall()
        return [dict(zip(columns, row)) for row in rows]

    except pyodbc.Error as e:
        print("Lỗi SELECT:", e)
        return None
    finally:
        conn.close()

# 4. Hàm INSERT / UPDATE / DELETE
def editData(query: str, params: tuple = ()):
    """
    Thực thi INSERT/UPDATE/DELETE.
    - query: Câu lệnh SQL
    - params: Tham số truyền vào (tuple)
    """
    conn = get_db_connection()
    if not conn:
        return False

    try:
        #Thực thi 1 trong 2 lệnh UPDATE và DELETE
        cursor = conn.cursor()
        cursor.execute(query, params)

        # Nếu là INSERT thì trả về ID vừa thêm
        # if query.strip().upper().startswith("INSERT"):
        #     cursor.execute("SELECT SCOPE_IDENTITY()")
        #     new_id = cursor.fetchone()[0]
        conn.commit()

        
        return cursor.rowcount
    except pyodbc.Error as e:
        print("Lỗi ghi dữ liệu:", e)
        conn.rollback()
        raise
    finally:
        if conn: conn.close()
