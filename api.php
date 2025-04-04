<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

$conn = new mysqli("localhost", "root", "", "student_db",3307);
$data = json_decode(file_get_contents("php://input"), true);

switch ($data["action"]) {
    case "login":
    $username = $data['data']['username'];
    $password = $data['data']['password'];

    $result = $conn->query("SELECT * FROM users WHERE username='$username' AND password='$password'");
    
    if ($result->num_rows > 0) {
        echo json_encode(["success" => true, "message" => "Login successful!"]);
    } else {
        echo json_encode(["success" => false, "message" => "Invalid credentials!"]);
    }
    break;

    case "register":
        $username = $data['data']['username'];
        $password = $data['data']['password'];
        
        $stmt = $conn->prepare("INSERT INTO users (username, password) VALUES (?, ?)");
        $stmt->bind_param("ss", $username, $password);
        
            if ($stmt->execute()) {
                echo json_encode(["success" => true, "message" => "Registered Successfully!"]);
            } else {
                echo json_encode(["success" => false, "message" => "Registration failed: " . $stmt->error]);
            }
            $stmt->close();
            break;
        
    case "getStudents":
        $result = $conn->query("SELECT * FROM students");
        echo json_encode($result->fetch_all(MYSQLI_ASSOC));
        break;
    case "addStudent":
        $conn->query("INSERT INTO students (name, email, age) VALUES ('{$data['data']['name']}', '{$data['data']['email']}', {$data['data']['age']})");
        echo json_encode(["status" => "success"]);
        break;
    case "updateStudent":
        $conn->query("UPDATE students SET name='{$data['data']['name']}', email='{$data['data']['email']}', age={$data['data']['age']} WHERE id={$data['data']['id']}");
        echo json_encode(["status" => "success"]);
        break;
    case "deleteStudent":
        $conn->query("DELETE FROM students WHERE id={$data['id']}");
        echo json_encode(["status" => "success"]);
        break;
}
?>
