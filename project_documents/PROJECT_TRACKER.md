# Quy Trình Commit Code Chuyên Nghiệp cho Dự Án Web Chat Online

Dưới đây là hướng dẫn chi tiết về cách commit code một cách chuyên nghiệp trong quá trình phát triển dự án Web Chat Online.

## 1. Quy Ước Đặt Tên Commit

Sử dụng quy ước [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**Các loại type phổ biến:**
- `feat`: Thêm tính năng mới
- `fix`: Sửa lỗi
- `docs`: Thay đổi tài liệu
- `style`: Thay đổi không ảnh hưởng đến code (format, semicolons,...)
- `refactor`: Tái cấu trúc code
- `test`: Thêm hoặc sửa test
- `chore`: Thay đổi cấu hình, build tasks, package manager, ...

## 2. Chiến Lược Phân Nhánh Git

Sử dụng mô hình GitFlow đơn giản:

- `main`: Nhánh chính ổn định, chỉ merge từ develop
- `develop`: Nhánh phát triển chính
- `feature/ten-tinh-nang`: Nhánh phát triển tính năng
- `bugfix/mo-ta-loi`: Nhánh sửa lỗi
- `release/x.y.z`: Nhánh chuẩn bị release

## 3. Quy Trình Commit Cho Dự Án Web Chat Online

### Giai Đoạn 1: Khởi tạo dự án

```bash
# Khởi tạo Git repository
git init
git add .
git commit -m "chore: initial project setup"
git branch -M main

# Tạo nhánh develop
git checkout -b develop
```

### Giai Đoạn 2: Thiết lập cấu trúc dự án

```bash
# Tạo nhánh feature
git checkout -b feature/project-structure develop

# Sau khi tạo cấu trúc thư mục
git add .
git commit -m "feat: create initial project structure
- Setup backend directory structure
- Setup frontend directory structure
- Add necessary configuration files"

# Merge về develop
git checkout develop
git merge --no-ff feature/project-structure
git branch -d feature/project-structure
```

### Giai Đoạn 3: Backend development

```bash
# Tạo nhánh feature cho backend models
git checkout -b feature/backend-models develop

# Commit cho từng model
git add backend/models/user.model.js
git commit -m "feat(backend): implement user model
- Create user schema with Mongoose
- Add password encryption with bcrypt
- Implement methods for password validation"

git add backend/models/chat.model.js
git commit -m "feat(backend): implement chat model
- Create chat schema for both direct and group chats
- Add reference to latest message"

git add backend/models/message.model.js
git commit -m "feat(backend): implement message model
- Create message schema
- Add read status tracking"

# Merge về develop
git checkout develop
git merge --no-ff feature/backend-models
git branch -d feature/backend-models
```

### Giai Đoạn 4: Middleware & Auth

```bash
git checkout -b feature/auth-middleware develop

git add backend/middleware/auth.middleware.js
git commit -m "feat(backend): implement authentication middleware
- Create JWT verification
- Implement user authorization"

git add backend/controllers/auth.controller.js
git add backend/routes/auth.routes.js
git commit -m "feat(backend): implement authentication system
- Add user registration endpoint
- Add user login with JWT
- Implement logout functionality"

git checkout develop
git merge --no-ff feature/auth-middleware
git branch -d feature/auth-middleware
```

### Giai Đoạn 5: Controllers & Routes

```bash
git checkout -b feature/api-endpoints develop

git add backend/controllers/user.controller.js
git add backend/routes/user.routes.js
git commit -m "feat(backend): implement user endpoints
- Add user profile retrieval
- Add friend request functionality
- Implement user search"

git add backend/controllers/chat.controller.js
git add backend/routes/chat.routes.js
git commit -m "feat(backend): implement chat endpoints
- Add chat creation for direct messages
- Add group chat functionality
- Implement chat retrieval"

git add backend/controllers/message.controller.js
git add backend/routes/message.routes.js
git commit -m "feat(backend): implement message endpoints
- Add message sending functionality
- Implement message retrieval with pagination
- Add read status update"

git checkout develop
git merge --no-ff feature/api-endpoints
git branch -d feature/api-endpoints
```

### Giai Đoạn 6: Socket.IO Integration

```bash
git checkout -b feature/socket-integration develop

git add backend/socket/socket.js
git commit -m "feat(backend): implement real-time socket functionality
- Add user online status tracking
- Implement real-time messaging
- Add typing indicator functionality"

git checkout develop
git merge --no-ff feature/socket-integration
git branch -d feature/socket-integration
```

### Giai Đoạn 7: Frontend Setup & Config

```bash
git checkout -b feature/frontend-setup develop

git add frontend/package.json frontend/tailwind.config.js
git commit -m "chore(frontend): initialize React project with Vite
- Configure package.json
- Setup Tailwind CSS"

git add frontend/src/main.jsx frontend/src/App.jsx
git commit -m "feat(frontend): setup React application
- Configure main entry point
- Create App component structure"

git checkout develop
git merge --no-ff feature/frontend-setup
git branch -d feature/frontend-setup
```

### Giai Đoạn 8: Frontend Components & Pages

```bash
git checkout -b feature/frontend-auth develop

git add frontend/src/context/AuthContext.jsx
git add frontend/src/pages/Login.jsx frontend/src/pages/Register.jsx
git commit -m "feat(frontend): implement authentication system
- Create AuthContext for state management
- Implement login page with form validation
- Create registration page"

git checkout develop
git merge --no-ff feature/frontend-auth
git branch -d feature/frontend-auth

# Tương tự cho các tính năng khác
git checkout -b feature/chat-interface develop
# ... 
```

### Giai Đoạn 9: Sửa lỗi & Tối ưu

```bash
git checkout -b bugfix/auth-token-issue develop

git add backend/controllers/auth.controller.js
git commit -m "fix(backend): resolve authentication token issues
- Fix token expiration handling
- Add better error messages
- Resolve cookie persistence issues"

git checkout develop
git merge --no-ff bugfix/auth-token-issue
git branch -d bugfix/auth-token-issue
```

### Giai Đoạn 10: Release

```bash
git checkout -b release/1.0.0 develop

# Thực hiện các điều chỉnh cuối cùng
git add .
git commit -m "chore: prepare v1.0.0 release
- Update version numbers
- Cleanup comments
- Fine-tune performance"

# Merge vào main và develop
git checkout main
git merge --no-ff release/1.0.0
git tag -a v1.0.0 -m "Version 1.0.0"

git checkout develop
git merge --no-ff release/1.0.0
git branch -d release/1.0.0

# Push lên remote repository
git push origin main --tags
git push origin develop
```

## 4. Mẫu Commit Messages Chi Tiết

### Frontend Commit

```
feat(frontend): implement chat message component

- Create MessageBubble component for rendering chat messages
- Add support for different message types (text, image)
- Implement read receipts
- Add timestamp formatting

Resolves: #42
```

### Backend Commit

```
fix(backend): resolve message pagination issues

- Fix SQL query for retrieving paginated messages
- Optimize query performance with proper indexing
- Add proper error handling for empty chats
- Ensure messages are sorted correctly by timestamp

Resolves: #57
```

## 5. Các Lệnh Git Hữu Ích

```bash
# Xem trạng thái thay đổi
git status

# Xem lịch sử commit
git log --oneline --graph --decorate

# Tạo stash khi cần chuyển task
git stash save "Đang làm dở tính năng chat"
git stash pop

# Squash các commit nhỏ trước khi merge
git rebase -i HEAD~3

# Cherry-pick commit từ nhánh khác
git cherry-pick commit_hash
```

Tuân thủ những quy tắc này sẽ giúp dự án Web Chat Online của bạn có lịch sử commit rõ ràng, dễ theo dõi và chuyên nghiệp, đồng thời hỗ trợ tốt cho việc phát triển theo nhóm.