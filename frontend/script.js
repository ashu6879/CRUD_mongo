document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.getElementById('data-table-body');
    const apiUrl = 'https://mongo-crud-two.vercel.app'; // Update this if using a different URL
    const loader = document.getElementById('loader'); // Loader element

    const showLoader = () => loader.style.display = 'block';
    const hideLoader = () => loader.style.display = 'none';

    // Fetch and display all users
    const fetchData = () => {
        showLoader(); // Show loader before fetching
        fetch(`${apiUrl}/`)
            .then(response => response.json())
            .then(data => {
                tableBody.innerHTML = '';

                data.forEach(user => {
                    const row = document.createElement('tr');
                    row.dataset.id = user._id; // Set data-id attribute for easy reference
                    row.innerHTML = `
                        <td>${user.name}</td>
                        <td>${user.email}</td>
                        <td>
                            <a href="#" class="btn btn-success btn-sm" onclick="openUpdateModal('${user._id}', '${user.name}', '${user.email}')">Update</a>
                            <a href="#" class="btn btn-danger btn-sm" onclick="deleteUser('${user._id}', this)">Delete</a>
                        </td>
                    `;
                    tableBody.appendChild(row);
                });
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            })
            .finally(() => {
                hideLoader(); // Hide loader after fetching is complete
            });
    };

    fetchData(); // Initial fetch

    // Open the update modal with user data
    window.openUpdateModal = (id, name, email) => {
        document.getElementById('updateId').value = id;
        document.getElementById('updateName').value = name;
        document.getElementById('updateEmail').value = email;
        $('#updateModal').modal('show'); // Use jQuery to show the modal
    };

    // Handle form submission for updating a user
    document.getElementById('updateForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const id = document.getElementById('updateId').value;
        const name = document.getElementById('updateName').value;
        const email = document.getElementById('updateEmail').value;

        fetch(`${apiUrl}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email })
        })
            .then(response => response.json())
            .then(updatedUser => {
                console.log('User updated:', updatedUser);
                // Update the table with new data
                const row = tableBody.querySelector(`tr[data-id="${id}"]`);
                row.cells[0].textContent = updatedUser.name;
                row.cells[1].textContent = updatedUser.email;
                $('#updateModal').modal('hide'); // Hide the modal
            })
            .catch(error => {
                console.error('Error updating user:', error);
            });
    });

    // Function to delete a user
    window.deleteUser = (id, btnElement) => {
        if (confirm('Are you sure you want to delete this user?')) {
            fetch(`${apiUrl}/${id}`, { method: 'DELETE' })
                .then(response => response.json())
                .then(result => {
                    console.log(result.message);
                    // Remove the user from the table
                    const row = btnElement.closest('tr'); // Find the closest <tr> element
                    row.remove();
                })
                .catch(error => {
                    console.error('Error deleting user:', error);
                });
        }
    };

    // Handle form submission for adding a new user
    document.getElementById('addUserForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('addName').value;
        const email = document.getElementById('addEmail').value;

        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email })
        })
            .then(response => response.json())
            .then(newUser => {
                console.log('User added:', newUser);
                // Add the new user to the table
                const row = document.createElement('tr');
                row.dataset.id = newUser._id;
                row.innerHTML = `
                    <td>${newUser.name}</td>
                    <td>${newUser.email}</td>
                    <td>
                        <a href="#" class="btn btn-success btn-sm" onclick="openUpdateModal('${newUser._id}', '${newUser.name}', '${newUser.email}')">Update</a>
                        <a href="#" class="btn btn-danger btn-sm" onclick="deleteUser('${newUser._id}', this)">Delete</a>
                    </td>
                `;
                tableBody.appendChild(row);
                $('#addUserModal').modal('hide'); // Hide the modal
            })
            .catch(error => {
                console.error('Error adding user:', error);
            });
    });
});
