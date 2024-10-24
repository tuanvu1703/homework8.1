const apiURL = 'https://671a32c6acf9aa94f6a992e6.mockapi.io/api/product'; // Thay thế bằng URL MockAPI của bạn

// Hàm để lấy tất cả khách sạn (READ)
function getHotels(callback) {
    fetch(apiURL)
        .then(response => response.json())
        .then(data => callback(null, data))
        .catch(error => callback(error, null));
}

// Hàm để tạo một khách sạn mới (CREATE)
function createHotel(hotelData, callback) {
    fetch(apiURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(hotelData)
    })
        .then(response => response.json())
        .then(data => callback(null, data))
        .catch(error => callback(error, null));
}

// Hàm để cập nhật một khách sạn (UPDATE)
function updateHotel(id, hotelData, callback) {
    fetch(`${apiURL}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(hotelData)
    })
        .then(response => response.json())
        .then(data => callback(null, data))
        .catch(error => callback(error, null));
}

// Hàm để xóa một khách sạn (DELETE)
function deleteHotel(id, callback) {
    fetch(`${apiURL}/${id}`, {
        method: 'DELETE',
    })
        .then(response => response.json())
        .then(data => callback(null, data))
        .catch(error => callback(error, null));
}

// Hàm để hiển thị các khách sạn trong bảng
function handleHotels(error, data) {
    if (error) {
        console.error('Lỗi khi lấy dữ liệu khách sạn:', error);
    } else {
        const hotelTableBody = document.getElementById('hotelTableBody');
        let rows = '';
        data.forEach(hotel => {
            rows += `<tr>                                                
                <td>${hotel.id}</td>                                                
                <td>${hotel.name}</td>                                                
                <td>${hotel.price}</td>                                                
                <td>
                    <button class="btn btn-danger" onclick="deleteHotel(${hotel.id}, refreshHotels)">Xóa</button>
                    <button class="btn btn-warning" onclick="editHotel(${hotel.id}, '${hotel.name}', ${hotel.price})">Sửa</button>
                </td>
            </tr>`;
        });
        hotelTableBody.innerHTML = rows;
    }
}

// Làm mới danh sách khách sạn sau bất kỳ hành động nào
function refreshHotels() {
    getHotels(handleHotels);
}

// Xử lý việc gửi biểu mẫu để thêm khách sạn mới
document.getElementById('hotelForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const hotelName = document.getElementById('hotelName').value;
    const hotelPrice = document.getElementById('hotelPrice').value;
    
    const newHotel = {
        name: hotelName,
        price: hotelPrice
    };

    createHotel(newHotel, function (error, data) {
        if (error) {
            console.error('Lỗi khi thêm khách sạn:', error);
        } else {
            console.log('Khách sạn đã thêm:', data);
            refreshHotels();
            resetForm();
        }
    });
});

// Hàm để điền trước dữ liệu vào biểu mẫu để sửa khách sạn
function editHotel(id, name, price) {
    document.getElementById('hotelName').value = name;
    document.getElementById('hotelPrice').value = price;
    
    // Khi gửi biểu mẫu, chúng ta sẽ cập nhật thay vì tạo mới
    document.getElementById('hotelForm').onsubmit = function (e) {
        e.preventDefault();
        const updatedHotel = {
            name: document.getElementById('hotelName').value,
            price: document.getElementById('hotelPrice').value
        };

        updateHotel(id, updatedHotel, function (error, data) {
            if (error) {
                console.error('Lỗi khi cập nhật khách sạn:', error);
            } else {
                console.log('Khách sạn đã cập nhật:', data);
                refreshHotels();
                resetForm();
            }
        });
    };
}

// Đặt lại biểu mẫu về hành vi mặc định sau khi cập nhật
function resetForm() {
    document.getElementById('hotelForm').reset();
    document.getElementById('hotelForm').onsubmit = function (e) {
        e.preventDefault();
        const hotelName = document.getElementById('hotelName').value;
        const hotelPrice = document.getElementById('hotelPrice').value;

        const newHotel = {
            name: hotelName,
            price: hotelPrice
        };

        createHotel(newHotel, function (error, data) {
            if (error) {
                console.error('Lỗi khi thêm khách sạn:', error);
            } else {
                refreshHotels();
            }
        });
    };
}

// Lời gọi ban đầu để lấy và hiển thị các khách sạn
refreshHotels();
