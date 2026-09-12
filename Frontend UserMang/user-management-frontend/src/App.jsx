import { useEffect, useState } from "react";

function App() {
  // ---------------- LOGIN ----------------

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loggedInUser, setLoggedInUser] = useState(null);

  // ---------------- USERS ----------------

  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);

  // ---------------- SEARCH ----------------

  const [searchName, setSearchName] = useState("");

  // ---------------- ADD / UPDATE ----------------

  const [name, setName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [role, setRole] = useState("");

  const [editId, setEditId] = useState(null);

  // ---------------- EXCEL ----------------

  const [selectedFile, setSelectedFile] = useState(null);

  // LOGIN
  // =====================================================

  const handleLogin = async () => {
    if (email === "" || password === "") {
      alert("Please enter email and password");
      return;
    }

 try {
   const response = await fetch(
   "http://localhost:8080/api/users/login",
   {
     method: "POST",
     headers: {
              "Content-Type": "application/json",
          },
      body: JSON.stringify({
                  email: email,
      password: password,
          }),
        }
      );
    if (response.ok) {
        const user = await response.json();
        setLoggedInUser(user);

        // Load users only for ADMIN
        if (user.role === "ADMIN") {
          loadUsers();
        }
      } else {
        alert("Invalid email or password");
      }
    } catch (error) {
      console.log(error);
      alert("Error connecting to backend");
    }
  };

  // LOAD USERS
  // =====================================================
  const loadUsers = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/users"
      );

      const data = await response.json();

      setUsers(data);
      setFilteredUsers(data);
    } catch (error) {
      console.log(error);
      alert("Error loading users");
    }
  };

  // ADD USER
  // =====================================================

  const handleAddUser = async () => {
    if (
      name === "" ||
      userEmail === "" ||
      userPassword === "" ||
      role === ""
    ) {
      alert("Please fill all fields");
      return;
    }

  try {
    const response = await fetch(
   "http://localhost:8080/api/users",
      {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name,
            email: userEmail,
            password: userPassword,
            role: role,
          }),
        }
      );
      if (response.ok) {
        alert("User added successfully");

        clearForm();
        loadUsers();
      } else {
        alert("Error adding user");
      }
    } catch (error) {
      console.log(error);
      alert("Error connecting to backend");
    }
  };

  // DELETE USER
  // =====================================================

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmDelete) {
      return;
    }

  try {
    const response = await fetch(
          `http://localhost:8080/api/users/${id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        alert("User deleted successfully");
        loadUsers();
      } else {
        alert("Error deleting user");
      }
    } catch (error) {
      console.log(error);
      alert("Error connecting to backend");
    }
  };

  // SEARCH USER
  // =====================================================

 const handleSearch = async () => {
    if (searchName.trim() === "") {
      loadUsers();
      return;
    }

  try {
      const response = await fetch(
        `http://localhost:8080/api/users/search?keyword=${searchName}`
      );

      const data = await response.json();

      setFilteredUsers(data);
    } catch (error) {
      console.log(error);
      alert("Error searching users");
    }
  };

  // EDIT USER
  // =====================================================

  const handleEdit = (user) => {
    setName(user.name);
    setUserEmail(user.email);
    setUserPassword(user.password);
    setRole(user.role);

    setEditId(user.id);
  };

  // UPDATE USER
  // =====================================================

  const handleUpdateUser = async () => {
    if (
      name === "" ||
      userEmail === "" ||
      userPassword === "" ||
      role === ""
    ) {
      alert("Please fill all fields");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/api/users/${editId}`,
      {
      method: "PUT",
       headers: {
                "Content-Type": "application/json",
          },
    body: JSON.stringify({
      name: name,
      email: userEmail,
      password: userPassword,
      role: role,
          }),
        }
      );

if (response.ok) {
    alert("User updated successfully");
    clearForm();
    loadUsers();
      } else {
        alert("Error updating user");
      }
    } catch (error) {
      console.log(error);
      alert("Error connecting to backend");
    }
  };

  // CLEAR FORM
  // =====================================================

  const clearForm = () => {
    setName("");
    setUserEmail("");
    setUserPassword("");
    setRole("");
    setEditId(null);
  };

  // SELECT EXCEL FILE
  // =====================================================

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  // UPLOAD EXCEL
  // =====================================================

 const handleUpload = async () => {
    if (selectedFile === null) {
      alert("Please select an Excel file");
      return;
    }
 const formData = new FormData();

    formData.append("file", selectedFile);
    
//Upload API
try {
    const response = await fetch(
     "http://localhost:8080/api/users/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const message = await response.text();

      if (response.ok) {
        alert(message);

        setSelectedFile(null);

        loadUsers();
      } else {
        alert("Upload failed: " + message);
      }
    } catch (error) {
      console.log(error);
      alert("Error connecting to backend");
    }
  };

  // DOWNLOAD EXCEL
  // =====================================================
  const handleDownload = () => {
    window.open(
      "http://localhost:8080/api/users/download",
      "_blank"
    );
  };

  // LOGOUT
  // =====================================================

  const handleLogout = () => {
    setLoggedInUser(null);

    setEmail("");
    setPassword("");

    clearForm();

    setSearchName("");
    setUsers([]);
    setFilteredUsers([]);
  };

  // LOGIN PAGE
  // =====================================================
 if (loggedInUser === null) {
    return (
      <div className="login-container">
        <div className="login-box">
     <h1>Login</h1>

     <input
       type="email"
        placeholder="Enter email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        />
      <input
      type="password"
      placeholder="Enter password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
          />
 <button onClick={handleLogin}>
      Login
    </button>
   </div>

      </div>
    );
  }

  // USER ROLE
  // =====================================================

  if (loggedInUser.role !== "ADMIN") {
    return (
    <div className="page-container">
    <div className="restricted-box">
   <h1>Access Restricted</h1>
   <p>
        You do not have permission to access
        User Management.
    </p>

    <button onClick={handleLogout}>
      Logout
     </button>

      </div>

      </div>
    );
  }

  // ADMIN USER MANAGEMENT PAGE
  // =====================================================

  return (
   <div className="page-container">

   <div className="container">

    <div className="header">
    <div>
      <h1>User Management</h1>
       <p>
        Welcome, {loggedInUser.name}
            </p>
          </div>

          <button onClick={handleLogout}>
            Logout
          </button>

        </div>

        {/* SEARCH */}

        <div className="section">

          <h2>Search User</h2>

  <div className="search-box">
   <input
      type="text"
   placeholder="Search by name or email"
        value={searchName}
   onChange={(e) =>       setSearchName(e.target.value)
              }
            />
<button onClick={handleSearch}>
    Search
            </button>
    <button
              onClick={() => {
                setSearchName("");
                loadUsers();
              }}
            >
              Reset
            </button>

          </div>

        </div>

        {/* USER LIST */}

  <div className="section">
 <h2>User List</h2>

          <table>

            <thead>

              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>

 {filteredUsers.map((user) => (

  <tr key={user.id}>

  <td>{user.name}</td>
  <td>{user.email}</td>
  <td>{user.role}</td>
  <td>
<button
   onClick={() =>
   handleEdit(user)
    }
     >
    Edit
   </button>

         <button
        onClick={() =>
       handleDelete(user.id)
                     }
                    >
                      Delete
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

        {/* ADD / UPDATE */}

        <div className="section">

          <h2>
            {editId === null
              ? "Add User"
              : "Update User"}
          </h2>

          <div className="form-group">

            <input
              type="text"
              placeholder="Enter name"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
            />

            <input
              type="email"
              placeholder="Enter email"
              value={userEmail}
              onChange={(e) =>
                setUserEmail(e.target.value)
              }
            />

            <input
              type="password"
              placeholder="Enter password"
              value={userPassword}
              onChange={(e) =>
                setUserPassword(e.target.value)
              }
            />

            <select
              value={role}
              onChange={(e) =>
                setRole(e.target.value)
              }
            >
              <option value="">
                Select Role
              </option>

              <option value="ADMIN">
                ADMIN
              </option>

              <option value="USER">
                USER
              </option>

            </select>

            <div className="form-buttons">

              {editId === null ? (

                <button onClick={handleAddUser}>
                  Add User
                </button>

              ) : (

                <>
                  <button
                    onClick={handleUpdateUser}
                  >
                    Update User
                  </button>

                  <button
                    onClick={clearForm}
                  >
                    Cancel
                  </button>
                </>

              )}

            </div>

          </div>

        </div>

        {/* EXCEL */}

   <div className="section">

    <h2>Upload Users from Excel</h2>

   <div className="upload-box">

   <input
      type="file"
       accept=".xlsx"
       onChange={handleFileChange}
            />

<button onClick={handleUpload}>
          Upload
            </button>

            <button onClick={handleDownload}>
              Download Excel
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default App;