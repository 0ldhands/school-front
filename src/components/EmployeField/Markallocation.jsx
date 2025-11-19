import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../../config';
import Alert from '@mui/material/Alert';

const Markallocation = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedExam, setSelectedExam] = useState('');
  const [examNames, setExamNames] = useState([]);
  const [examId, setExamId] = useState(null); // To store selected exam id
  const [message, setMessage] = useState(null); // State to store alert messages
  const [errors, setErrors] = useState({}); // State to store validation errors

  const staff_id = sessionStorage.getItem('staff_id');

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get(`${config.apiURL}/attenance/classstudents/${staff_id}`);
        const studentsWithMarks = response.data.map(student => ({
          stu_id: student.stu_id,
          stu_name: student.stu_name,
          tamil: '',
          english: '',
          maths: '',
          science: '',
          social:'',
          total: '',
        }));
        setStudents(studentsWithMarks);
        setFilteredStudents(studentsWithMarks);
      } catch (error) {
        console.log('Error fetching students:', error);
      }
    };

    const fetchExams = async () => {
      try {
        const response = await axios.get(`${config.apiURL}/students/getexamsalloc`);
        setExamNames(response.data || []);
      } catch (error) {
        console.error('Error fetching exams:', error);
      }
    };

    fetchStudents();
    fetchExams();
  }, [staff_id]);

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    if (value > 100) {
      setMessage({ type: 'error', text: 'Marks cannot exceed 100.' });
      return;
    }
    const updatedStudents = [...filteredStudents];
    updatedStudents[index][name] = value;
    updatedStudents[index].total =
      (parseInt(updatedStudents[index].tamil, 10) || 0) +
      (parseInt(updatedStudents[index].english, 10) || 0) +
      (parseInt(updatedStudents[index].maths, 10) || 0) +
      (parseInt(updatedStudents[index].science, 10) || 0) +
      (parseInt(updatedStudents[index].social, 10) || 0);
    setFilteredStudents(updatedStudents);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (examId === null) {
      setMessage({ type: 'error', text: 'Please select an exam.' });
      return;
    }
  
    let valid = true;
    const newErrors = {};
    filteredStudents.forEach((student, index) => {
      ['tamil', 'english', 'maths', 'science', 'social'].forEach(subject => {
        if (student[subject] === '') {
          valid = false;
          newErrors[index] = newErrors[index] || {};
          newErrors[index][subject] = 'This field is required';
        }
      });
    });
    setErrors(newErrors);
  
    if (!valid) {
      setMessage({ type: 'error', text: 'Please fill all the fields.' });
      return;
    }
  
    const dataToSave = filteredStudents.map(student => ({
      stu_id: student.stu_id,
      stu_name: student.stu_name,
      tamil: student.tamil,
      english: student.english,
      maths: student.maths,
      science: student.science,
      social: student.social,
      total: student.total,
      examname: selectedExam,
      exam_id: examId
    }));
  
    try {
      const response = await axios.post(`${config.apiURL}/students/saveStudentMarks`, dataToSave);
      if (response.data.error) {
        if (response.data.error === 'All records already exist') {
          setMessage({ type: 'info', text: 'Marks for these students and exam have already been saved.' });
        } else {
          setMessage({ type: 'error', text: response.data.error });
        }
      } else {
        setMessage({ type: 'success', text: response.data.message || 'Marks saved successfully!' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'There was an error saving the marks!' });
      console.error('There was an error saving the marks!', error);
    }
  };
  
  
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    filterStudents(query, selectedClass);
  };

  const handleClassFilter = (e) => {
    const selectedClass = e.target.value;
    setSelectedClass(selectedClass);
    filterStudents(searchQuery, selectedClass);
  };

  const handleExamChange = (e) => {
    const examName = e.target.value;
    setSelectedExam(examName);

    const examObject = examNames.find(exam => exam.exam_name === examName);
    if (examObject) {
      setExamId(examObject.exam_id);
    } else {
      setExamId(null);
    }
  };

  const filterStudents = (query, classFilter) => {
    const filtered = students.filter(student =>
      (student.stu_name.toLowerCase().includes(query) || student.stu_id.toString().includes(query)) &&
      (classFilter === '' || student.class === classFilter)
    );
    setFilteredStudents(filtered);
  };

  const tableStyle = {
    border: '2px solid #333',
    borderRadius: '8px',
    backgroundColor: '#f8f9fa',
  };

  const cellStyle = {
    textAlign: 'center',
    verticalAlign: 'middle',
  };

  const theadStyle = {
    backgroundColor: '#343a40',
    color: '#fff',
  };

  return (
    <div className="container mt-5">
      <div className="d-flex mb-3">
        <select
          value={selectedExam}
          onChange={handleExamChange}
          className="form-select me-2"
          aria-label="Select Exam"
        >
          <option value="">Select Exam</option>
          {examNames.map(exam => (
            <option key={exam.exam_id} value={exam.exam_name}>
              {exam.exam_name}
            </option>
          ))}
        </select>
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          className="form-control me-2"
          placeholder="Search by student ID or name"
        />
       
      </div>

      {message && (
        <Alert severity={message.type} onClose={() => setMessage(null)}>
        {message.text}
    </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <table className="table" style={tableStyle}>
          <thead style={theadStyle}>
            <tr>
              <th>Student ID</th>
              <th>Student Name</th>
              <th>Tamil</th>
              <th>English</th>
              <th>Maths</th>
              <th>Science</th>
              <th>Social</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student, index) => (
              <tr key={student.stu_id}>
                <td>{student.stu_id}</td>
                <td>{student.stu_name}</td>
                <td>
                  <input
                    type="number"
                    name="tamil"
                    value={student.tamil}
                    onChange={(e) => handleInputChange(e, index)}
                    style={cellStyle}
                    min="0"
                    max="100"
                  />
                  {errors[index] && errors[index].tamil && (
                    <div className="text-danger">{errors[index].tamil}</div>
                  )}
                </td>
                <td>
                  <input
                    type="number"
                    name="english"
                    value={student.english}
                    onChange={(e) => handleInputChange(e, index)}
                    style={cellStyle}
                    min="0"
                    max="100"
                  />
                  {errors[index] && errors[index].english && (
                    <div className="text-danger">{errors[index].english}</div>
                  )}
                </td>
                <td>
                  <input
                    type="number"
                    name="maths"
                    value={student.maths}
                    onChange={(e) => handleInputChange(e, index)}
                    style={cellStyle}
                    min="0"
                    max="100"
                  />
                  {errors[index] && errors[index].maths && (
                    <div className="text-danger">{errors[index].maths}</div>
                  )}
                </td>
                <td>
                  <input
                    type="number"
                    name="science"
                    value={student.science}
                    onChange={(e) => handleInputChange(e, index)}
                    style={cellStyle}
                    min="0"
                    max="100"
                  />
                  {errors[index] && errors[index].science && (
                    <div className="text-danger">{errors[index].science}</div>
                  )}
                </td>
                <td>
                  <input
                    type="number"
                    name="social"
                    value={student.social}
                    onChange={(e) => handleInputChange(e, index)}
                    style={cellStyle}
                    min="0"
                    max="100"
                  />
                  {errors[index] && errors[index].social && (
                    <div className="text-danger">{errors[index].social}</div>
                  )}
                </td>
                <td style={cellStyle}>{student.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <button type="submit" className="btn btn-primary mt-3">
          Save
        </button>
      </form>
    </div>
  );
};

export default Markallocation;
