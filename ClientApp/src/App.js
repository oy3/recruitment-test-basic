import React, { useState, useEffect } from 'react';

export default function App() {

    const [employees, setEmployees] = useState([])

    async function getEmployees() {
        return fetch("/employees").then(response => response.json());
    }

    async function createEmployee(name, value) {
        return fetch("/employees", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: name, value: value })
        });
    }

    async function updateEmployee(name, value) {
        return fetch("/employees", {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: name, value: value })
        });
    }

    function generateEmployeeId() {
        return Math.floor(Math.random() * 90000) + 10000;
    }

    async function addEmployee() {
        const fname = document.getElementById('fname').value;
        const lname = document.getElementById('lname').value;
        const mode = document.getElementById('mode').value;

        if (!fname || !lname) {
            alert('Invalid Input for first name and last name.')
        }
        else {
            const employee_id = generateEmployeeId();
            try {
                const response = mode === 'add' ? await createEmployee(`${fname} ${lname}`, employee_id) : updateEmployee(`${fname} ${lname}`, employee_id);
                const msg = mode === 'add' ? "Employee record created successfully" : `${employee_id} Employee record updated successfully`;
                alert(msg);
                window.location.reload();

            } catch (err) {
                alert(`${err.message}`);
            }
        }
    }

    function updateEmployeeRecord(name) {
        const nameArray = name.split(' ');
        document.getElementById('fname').value = nameArray[0];
        document.getElementById('lname').value = nameArray[1];
        document.getElementById('mode').value = 'edit';
        document.getElementById('submitBtn').innerText = "Update"
    }

    async function deleteEmployeeRecord(id) {
        try {
            await fetch(`/employees/${id}`, {
                method: 'DELETE',
            });
            alert('Employee record deleted successfully');
            fetchAndSetEmployees();
        } catch (err) {
            alert(`${err.message}`);
        }
    }

    async function fetchAndSetEmployees() {
        const response = await getEmployees();
        setEmployees(response);
    }

    useEffect(() => {
        fetchAndSetEmployees()
    }, [])

    return (
        <div>
            <nav className="navbar navbar-dark navbar-expand-md bg-dark py-3">
                <div className="container">
                    <a className="navbar-brand d-flex align-items-center" href="#">
                        <span className="bg-secondary rounded-2 p-2 d-flex justify-content-center align-items-center me-2">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" width='1.5em' fill="#ffffff">
                                {/* <!--! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --> */}
                                <path d="M72 88a56 56 0 1 1 112 0A56 56 0 1 1 72 88zM64 245.7C54 256.9 48 271.8 48 288s6 31.1 16 42.3V245.7zm144.4-49.3C178.7 222.7 160 261.2 160 304c0 34.3 12 65.8 32 90.5V416c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V389.2C26.2 371.2 0 332.7 0 288c0-61.9 50.1-112 112-112h32c24 0 46.2 7.5 64.4 20.3zM448 416V394.5c20-24.7 32-56.2 32-90.5c0-42.8-18.7-81.3-48.4-107.7C449.8 183.5 472 176 496 176h32c61.9 0 112 50.1 112 112c0 44.7-26.2 83.2-64 101.2V416c0 17.7-14.3 32-32 32H480c-17.7 0-32-14.3-32-32zm8-328a56 56 0 1 1 112 0A56 56 0 1 1 456 88zM576 245.7v84.7c10-11.3 16-26.1 16-42.3s-6-31.1-16-42.3zM320 32a64 64 0 1 1 0 128 64 64 0 1 1 0-128zM240 304c0 16.2 6 31 16 42.3V261.7c-10 11.3-16 26.1-16 42.3zm144-42.3v84.7c10-11.3 16-26.1 16-42.3s-6-31.1-16-42.3zM448 304c0 44.7-26.2 83.2-64 101.2V448c0 17.7-14.3 32-32 32H288c-17.7 0-32-14.3-32-32V405.2c-37.8-18-64-56.5-64-101.2c0-61.9 50.1-112 112-112h32c61.9 0 112 50.1 112 112z" /></svg>
                        </span>
                        <span>Employees</span>
                    </a>
                    <button className="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#navcol-1">
                        <span className="visually-hidden">Toggle navigation</span>
                        <span className="navbar-toggler-icon"></span>
                    </button>
                </div>
            </nav>

            <div className="container">
                <div className="row mt-5">
                    <div className="col-md-6 pe-md-5">
                        <h4 className="mb-5">Add New</h4>
                        <form>
                            <div className="mb-3"><label className="form-label">Full name</label>
                                <div className="input-group">
                                    <input className="form-control" id="fname" type="text" placeholder="First name" />
                                    <input className="form-control" id="lname" type="text" placeholder="Last name" />
                                    <input className="form-control" id="mode" type="hidden" value="add" />
                                </div>
                            </div>
                            <button onClick={addEmployee} id="submitBtn" className="btn btn-success form-control" type="button">Add</button>
                        </form>
                    </div>
                    <div className="col-md-6 mt-5 mt-md-0">
                        <h4 className="mb-5">Employee List</h4>
                        <div className="table-responsive">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th className="col-4" scope="col">Name</th>
                                        <th className="col-4" scope="col">Actions</th>
                                    </tr>
                                </thead>
                                {employees.length > 0 && (
                                    <tbody>
                                        {employees.map(employee => (
                                            <tr key={employee.id}>
                                                <td>{employee.name}</td>
                                                <td>
                                                    <button onClick={() => { updateEmployeeRecord(employee.name) }} className="btn btn-secondary btn-sm me-3" type="button">
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width='1em' fill="#ffffff">
                                                            {/* <!--! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --> */}
                                                            <path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160V416c0 53 43 96 96 96H352c53 0 96-43 96-96V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96z" />
                                                        </svg>
                                                    </button>
                                                    <button onClick={() => { deleteEmployeeRecord(employee.id) }} className="btn btn-danger btn-sm" type="button">
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width='1em' fill="#ffffff">
                                                            {/* <!-- Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --> */}
                                                            <path d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0H284.2c12.1 0 23.2 6.8 28.6 17.7L320 32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 96 0 81.7 0 64S14.3 32 32 32h96l7.2-14.3zM32 128H416V448c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V128zm96 64c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16z" />
                                                        </svg>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                        }
                                    </tbody>
                                )}
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
