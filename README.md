# ***Diễn đàn trao đổi về cây cảnh PLANTGURU***
## ***Thông tin nhóm***

| **Thứ tự nhóm** | **19** |
| --- | --- |
| **Thành viên** | **MSSV** |
| Đàm Thành Nam | 21522354 |
| Đoàn Thanh Tùng | 21521646 |
| Lê Khai Trí | 21521565 |
| Lê Ngọc Hưng | 21520889 |
| Lê Anh Tuấn | 21521626 |

---

## ***Hướng dẫn chạy dự án Next.js***

### **Yêu cầu hệ thống**

- **Node.js** (phiên bản >= 16.x) và **npm** (đi kèm với Node.js).
- Kiểm tra Node.js: `node -v`
- Kiểm tra npm: `npm -v`

### **Cài đặt Node.js và npm**

1. Truy cập [Node.js](https://nodejs.org/) và tải phiên bản **LTS (khuyến nghị)**.
2. Cài đặt Node.js theo hướng dẫn của hệ điều hành (Windows, macOS, Linux).
3. Sau khi cài đặt, kiểm tra lại bằng lệnh:
    - `node -v`
    - `npm -v`

### **Cách chạy dự án**

1. **Clone dự án**
Sử dụng git để clone project:
    
    ```bash
    git clone https://github.com/tungnk123/plant-guru-nextjs
    
    ```
    
2. **Cài đặt thư viện**
    - Chuyển vào thư mục dự án:
        
        ```bash
        cd <PROJECT_FOLDER>
        
        ```
        
    - Cài đặt các gói thư viện cần thiết:
        
        ```bash
        npm install
        
        ```
        
3. **Chạy dự án trong môi trường dev**
    - Khởi chạy dự án Next.js:
        
        ```bash
        npm run dev
        
        ```
        
    - Mở trình duyệt và truy cập: [http://localhost:3000](http://localhost:3000/)
4. **Build dự án (sản phẩm cuối cùng)**
    - Nếu muốn build project cho môi trường sản phẩm:
        
        ```bash
        npm run build
        
        ```
        
    - Sau khi build thành công, chạy thử ứng dụng:
        
        ```bash
        npm start
        
        ```
        

---

## ***Cấu trúc dự án***

| **Thư mục/File** | **Mô tả** |
| --- | --- |
| `/app` | Chứa source code của project |
| `/components` | Các thành phần giao diện (UI components) |
| `/public` | Chứa các file tĩnh như hình ảnh, favicon, file animation lottie |
| `next.config.js` | File cấu hình cho Next.js |
| `package.json` | File chứa các library bên thứ ba mà project sử dụng |

---

## ***Hướng dẫn chạy dự án ASP.NET Web API***

### **Backend chính:**

### **Yêu cầu hệ thống**

- **.NET SDK** (phiên bản >= 6.0) 
- Kiểm tra .NET SDK: `dotnet --version`
- **Visual studio** (phiên bản 2022) 

1. **Clone dự án**: Sử dụng git để clone project:
    ```bash
    git clone https://github.com/21522354/PlanGuruAPI
    ```
2. **Mở dự án bằng visual studio**: 
    - Mở visual studio chọn mở dự án có sẵn và trỏ thư mục đến thư mục dự án
3. **Chạy dự án**:
    ```bash
    dotnet run
    ```
    - Hoặc bấm vào nút run trong giao diện của visual studio

## ***Cấu trúc dự án***

| **Thư mục/tầng** | **Mô tả** |
| --- | --- |
| `Domain` | Chứa các entity model cốt lõi của ứng dụng |
| `Application` | Định nghĩa các luồng nghiệp vụ cụ thể (interface) mà ứng dụng cung cấp |
| `Infrastructure` | Sử dụng model từ Domain và sử dụng các giao diện được cung cấp từ Application để triển khai hệ thống |
| `Application(Web API)` | Chứa các endpoint để người dùng thao tác với hệ thống |

---

### **Quiz Service:**

1. **Clone dự án**: Sử dụng git để clone project:
    ```bash
    git clone https://github.com/TriKhaiLe/QuizService.git
    ```

2. **Tích hợp Firestore:**
    - Truy cập [Firebase Console](https://console.firebase.google.com)
    - Tạo project mới
    - Trong mục Project settings, tab General, sao chép Project ID
    - Chuyển sang tab Service Account, tạo khóa riêng mới và tải file JSON về
    - Trong Firestore database, tạo một database mới
    - Mở file `appsettings.json.example` trong project Quiz Service, gắn dữ liệu cho ProjectId đã sao chép, và gắn giá trị cho CredentialsPath là đường dẫn tới file private key JSON đã tải về

3. **Lấy Gemini API key:**
    - Truy cập [AI Studio](https://aistudio.google.com/app/apikey) và lấy API key, gắn vào ApiKey trong `appsettings.json.example`

4. **Đổi tên file:**
    - Đổi tên file `appsettings.json.example` thành `appsettings.json`

5. **Chạy dự án:**
    - Chạy lệnh `dotnet run` từ thư mục chứa file `appsettings.json`

## ***Sản phẩm từ source code***

### **FrontEnd:**

- Link GitHub: https://github.com/tungnk123/plant-guru-nextjs
- Link Deploy: [https://plantguru.vercel.app](https://plantguru.vercel.app/)

### **Backend:**

- Link GitHub: https://github.com/21522354/PlanGuruAPI
- Link Deploy: https://un-silent-backend-develop.azurewebsites.net/swagger/index.html

---

## ***Hình ảnh demo của trang web***
![image](https://github.com/user-attachments/assets/a0844276-01d9-45d7-b54d-c9bd8cd3cb1c)
![image](https://github.com/user-attachments/assets/081649d7-2af3-49d1-9a1b-d77d43fff2ed)
![image](https://github.com/user-attachments/assets/bb05e9db-42be-4d1b-87c0-c8d0a23400c4)
![image](https://github.com/user-attachments/assets/27f8de0a-05f8-42d5-bf6b-72a076f0ad62)
![image](https://github.com/user-attachments/assets/9cb92ca5-b3e5-47cc-8df7-be7d2a5ac45f)
![image](https://github.com/user-attachments/assets/5a29bd1a-3a9d-4e2a-8f52-3c8295561903)
![image](https://github.com/user-attachments/assets/75e31e62-99bb-4c79-87a1-95516ac0741f)
![image](https://github.com/user-attachments/assets/8152ce08-1de5-4889-8634-4f47d6ab57bc)
![image](https://github.com/user-attachments/assets/fab11fb6-27bf-466a-8716-822ff565ffc7)
![image](https://github.com/user-attachments/assets/b2460bf3-a30d-4888-80d8-de42f573e56c)
![image](https://github.com/user-attachments/assets/65c53669-e829-4f25-946a-9fb27d0e373d)
![image](https://github.com/user-attachments/assets/58092c08-dc40-415a-8f97-740428c2fe05)
![image](https://github.com/user-attachments/assets/68920ca3-9425-483a-ac7a-fcf8780d493a)
![image](https://github.com/user-attachments/assets/4095faa3-e02a-4468-a1a6-3f36b161199c)
![image](https://github.com/user-attachments/assets/86482e85-ddd9-4294-afcc-e34c8ab8910e)
![image](https://github.com/user-attachments/assets/b6fe353d-80ec-4172-854b-91f279f273a6)
![image](https://github.com/user-attachments/assets/40398208-4dda-40e0-b850-fa07058a46c7)
![image](https://github.com/user-attachments/assets/ea25b4e8-7eed-436f-b170-aae6aa8fafde)
![image](https://github.com/user-attachments/assets/31e455f8-100a-4ddc-b5f1-8305a8c333b2)
![image](https://github.com/user-attachments/assets/976686ab-94c1-4cbb-84c5-1c9ccd9d777f)
![image](https://github.com/user-attachments/assets/3ed3e419-f76c-432b-bfe5-c54d391f25eb)




