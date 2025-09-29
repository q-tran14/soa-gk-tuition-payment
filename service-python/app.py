from flask import Flask, jsonify, request
from flask_cors import CORS 
from db_connector import editData, getData
import os, datetime

# Khởi tạo ứng dụng Flask và Cấu hình Cổng
app = Flask(__name__)
CORS(app) # Cho phép các ứng dụng Front-end (như trang web) truy cập API này

# Lấy số cổng từ file .env. Nếu không có, mặc định là 5000
PORT = int(os.getenv("PORT", 5000)) 

#1. Lấy tất cả các loại học phí
@app.route('/tuitions', methods=['GET'])
def get_all_tuitions():
    query = "SELECT TuitionID, TuitionName, TuitionAmount, Semester, Year, EndDate FROM Tuition"
    
    # Gọi hàm kết nối và truy vấn:
    tuitions = getData(query)
    
    # Xử lý phản hồi
    if tuitions is None:
        # Nếu getData trả về None, nghĩa là có lỗi kết nối hoặc lỗi truy vấn SQL
        print("LỖI: Truy vấn SELECT bị lỗi hoặc kết nối DB thất bại.")
        return jsonify({"error": "Lỗi kết nối hoặc truy vấn cơ sở dữ liệu"}), 500
    
    # Nếu thành công, trả về dữ liệu dưới dạng JSON với mã 200 OK
    return jsonify(tuitions), 200


# 2. Lấy chi tiết một loại học phí theo ID
@app.route('/tuitions/<int:tuition_id>', methods=['GET'])
def get_tuition_by_id(tuition_id):
    #Khai báo biến để truy vấn SQL
    query = "SELECT * FROM Tuition WHERE TuitionID = ?" 
    
    # fetch_one=True để chỉ lấy một bản ghi duy nhất
    tuition = getData(query, params=(tuition_id,), fetch_one=True)
    
    # Xử lý phản hồi
    if tuition is None:
        return jsonify({"error": "Lỗi truy vấn cơ sở dữ liệu"}), 500
    
    if not tuition:
        # Nếu truy vấn thành công nhưng không tìm thấy bản ghi nào trả về mã 404 Not Found
        return jsonify({"message": f"Không tìm thấy học phí với ID: {tuition_id}"}), 404
        
    # Trả về chi tiết bản ghi tìm được + HTTP code (200 OK)
    return jsonify(tuition), 200


# 3. Thêm học phí mới
@app.route('/tuitions', methods=['POST'])
def create_tuition():
    # Lấy dữ liệu từ yêu cầu POST (dạng JSON)
    data = request.get_json()
    
    # Kiểm tra các dữ liệu NOT NULL
    if not all(k in data for k in ["TuitionName", "TuitionAmount", "Year"]):
        return jsonify({"error": "Thiếu TuitionName, TuitionAmount Hoặc Year"}), 400

    # Khai báo câu lệnh INSERT SQL:
    query = """
    INSERT INTO Tuition (TuitionName, TuitionAmount, Semester, [Year], EndDate) 
    VALUES (?, ?, ?, ?, ?)
    """
    
    # Xử lý ép kiểu dữ liệu
    try:
        # Số tiền - float
        amount_value = float(data['TuitionAmount']) 
        
        # Học kỳ (Nếu không có hoặc rỗng, gán None)
        semester_data = data.get('Semester')
        semester_value = semester_data if semester_data else None 
        
        # Năm - int
        year_value = int(data['Year'])

        # Ngày kết thúc - date/None
        end_date_str = data.get('EndDate') 
        end_date_for_db = None
        
        if end_date_str != "":
            # Chuyển chuỗi YYYY-MM-DD sang đối tượng date chuẩn
            end_date_for_db = datetime.datetime.strptime(end_date_str, '%Y-%m-%d').date()

    except ValueError:
        # Bắt lỗi nếu Amount, Year, hoặc Date không phải định dạng hợp lệ
        return jsonify({"error": "Lỗi định dạng dữ liệu (Amount, Year, hoặc Date không hợp lệ)"}), 400
    
    # Chuẩn bị Tuple tham số cuối cùng
    params = (
        data['TuitionName'], 
        amount_value, 
        semester_value, 
        year_value, 
        end_date_for_db
    )
    
    # Thực thi commit:
    success = editData(query, params)
    
    # Xử lý phản hồi:
    if success:
        return jsonify({"message": "Thêm học phí thành công"}), 201
        
    # Nếu editData trả về False, lỗi SQL đã xảy ra và đã được in ra terminal
    return jsonify({"error": "Lỗi server khi thêm học phí"}), 500


# 4. Cập nhật học phí theo ID
@app.route('/tuitions/<int:tuition_id>', methods=['PUT'])
def update_tuition(tuition_id):
    # Lấy dữ liệu JSON:
    data = request.get_json()
    updates, params = [], []
    
    # Xây dựng câu lệnh UPDATE động:
    # Lặp qua các trường hợp lệ và xây dựng phần SET của câu lệnh SQL.
    for key in ["TuitionName", "TuitionAmount", "Semester", "Year", "EndDate"]:
        if key in data:
            updates.append(f"{key} = ?")
            params.append(data[key])
    
    # Kiểm tra dữ liệu gửi lên:
    if not updates:
        # Nếu JSON gửi lên rỗng hoặc không chứa trường hợp lệ.
        return jsonify({"message": "Không có dữ liệu để cập nhật"}), 400

    # Hoàn thành câu lệnh SQL và các tham số:
    query = f"UPDATE Tuition SET {', '.join(updates)} WHERE TuitionID = ?"
    params.append(tuition_id) # Tham số cuối cùng là ID để điều kiện WHERE hoạt động
    
    # Thực thi commit
    if editData(query, params):
        # Nếu editData trả về True (Thành công)
        return jsonify({"message": f"Cập nhật học phí ID {tuition_id} thành công"}), 200
    
    # Nếu editData trả về False
    return jsonify({"error": "Lỗi server khi cập nhật (ID có thể không tồn tại)"}), 500


# 5. Xóa học phí
@app.route('/tuitions/<int:tuition_id>', methods=['DELETE'])
def delete_tuition(tuition_id):
    query = "DELETE FROM Tuition WHERE TuitionID = ?"
    
    # Thực thi commit
    # Chỉ cần chuyển ID cần xóa làm tham số
    if editData(query, params=(tuition_id,)): 
        # Nếu editData trả về True (Thành công)
        return jsonify({"message": f"Xóa học phí ID {tuition_id} thành công"}), 200
        
    # Nếu editData trả về False
    return jsonify({"error": "Lỗi server khi xóa"}), 500

# Khởi động Ứng dụng
if __name__ == '__main__':
    # Khối code này chạy server Flask
    print(f"Flask API đang chạy trên cổng: {PORT}")
    app.run(host='0.0.0.0', port=PORT, debug=True)
