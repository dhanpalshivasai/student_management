var app = angular.module("StudentApp", []);

app.controller("StudentController", function ($scope, $http) {
    $scope.isLoggedIn = false;
    $scope.students = [];
    $scope.showAddForm = false;  // Controls the Add Student modal visibility
    $scope.showUpdateForm = false;  // Controls the Update Student modal visibility
    $scope.newStudent = {};
    $scope.selectedStudent = {};

    $scope.submitLogin = function () {
        $http.post("api.php", { action: "login", data: $scope.login }).then(response => {
            alert(response.data.message);
            if (response.data.success) {
                $scope.isLoggedIn = true;
                window.location.href = "view.html";
            }
        });
    };

    $scope.submitRegister = function () {
        if ($scope.register.password !== $scope.register.repassword) {
            alert("Passwords do not match!");
            return;
        }
        $http.post("api.php", { action: "register", data: $scope.register }).then(response => {
            alert(response.data.message);
            if (response.data.success) {
                window.location.href = "index.html";
            }
        });
    };

    $scope.goToRegister = function () {
        window.location.href = "register.html";
    };

    $scope.logout = function () {
        $scope.isLoggedIn = false;
        $scope.login = {};
        window.location.href = "index.html";
    };

    $scope.fetchStudents = function () {
        $http.post("api.php", { action: "getStudents" }).then(response => {
            $scope.students = response.data;
        });
    };

    // Open the Add Student modal and reset the newStudent object
    $scope.openAddModal = function () {
        $scope.newStudent = {};  // Reset form fields
        $scope.showAddForm = true;  // Show the modal
    };

    // Close the Add Student modal
    $scope.closeAddModal = function () {
        $scope.showAddForm = false;  // Hide the modal
    };

    $scope.addStudent = function () {
        $http.post("api.php", { action: "addStudent", data: $scope.newStudent }).then(response => {
            alert("Student added successfully!");
            $scope.fetchStudents();  // Refresh the student list
            $scope.closeAddModal();  // Close the modal after adding
        });
    };

    $scope.updateStudent = function (student) {
        $scope.selectedStudent = angular.copy(student);
        $scope.showUpdateForm = true;
    };

    $scope.saveUpdate = function () {
        $http.post("api.php", { action: "updateStudent", data: $scope.selectedStudent }).then(response => {
            alert("Student updated successfully!");
            $scope.fetchStudents();
            $scope.showUpdateForm = false;
        });
    };

    $scope.deleteStudent = function (id) {
        $http.post("api.php", { action: "deleteStudent", id: id }).then(response => {
            alert("Student deleted successfully!");
            $scope.fetchStudents();
        });
    };

    // Fetch students when the page loads (only for view.html)
    if (window.location.pathname.includes("view.html")) {
        $scope.fetchStudents();
    }
});