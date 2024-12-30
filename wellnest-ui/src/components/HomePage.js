import React, {useState, useEffect} from 'react';
import './css/HomePage.css';
import {
    Carousel,
    Card,
    Container,
    Row,
    Col,
    Pagination,
    Form
} from 'react-bootstrap';
import {
    FaClipboardList,
    FaTooth,
    FaHeartbeat,
    FaEye,
    FaTint,
    FaBrain
} from 'react-icons/fa';
import Footer from './Footer';
import axios from 'axios';

function HomePage() {
    // State for storing doctor data
    const [doctors, setDoctors] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3;

    // Fetch doctor data from the backend API
    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/doctor-profile/');

                console.log('Fetched Doctors:', response.data);

                setDoctors(response.data);
            } catch (error) {
                console.error('Failed to fetch doctor profiles', error);
            }
        };

        fetchDoctors();
    }, []);

    // Filter doctors based on search query
    const filteredDoctors = doctors.filter(
        (doctor) => doctor.department && typeof doctor.department === 'string' && doctor.department.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Pagination calculations
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredDoctors.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(filteredDoctors.length / itemsPerPage);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div>
            <Carousel id='home-section'>
                <Carousel.Item>
                    <div
                        className="carousel-slide d-flex align-items-center"
                        style={{
                            backgroundImage: `url('/images/slider.jpg')`,
                            width: '100%',
                            backgroundSize: 'cover'
                        }}>
                        <div className="carousel-content">
                            <h2>We Provide
                                <span
                                    style={{
                                        color: '#a5c422'
                                    }}>Medical</span>
                                Services That You Can
                                <span
                                    style={{
                                        color: '#a5c422'
                                    }}>Trust!</span>
                            </h2>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris sed nisl
                                pellentesque, faucibus libero eu, gravida quam.</p>
                        </div>
                    </div>
                </Carousel.Item>

                <Carousel.Item>
                    <div
                        className="carousel-slide d-flex align-items-center"
                        style={{
                            backgroundImage: `url('/images/slider2.jpg')`,
                            width: '100%',
                            backgroundSize: 'cover'
                        }}>
                        <div className="carousel-content">
                            <h2>Providing
                                <span
                                    style={{
                                        color: '#a5c422'
                                    }}>Expert</span>
                                Care for Your Health</h2>
                            <p>Our medical team is dedicated to providing the best care for your health
                                needs with personalized services.</p>
                        </div>
                    </div>
                </Carousel.Item>

                <Carousel.Item>
                    <div
                        className="carousel-slide d-flex align-items-center"
                        style={{
                            backgroundImage: `url('/images/slider3.jpg')`,
                            width: '100%',
                            backgroundSize: 'cover'
                        }}>
                        <div className="carousel-content">
                            <h2>Your
                                <span
                                    style={{
                                        color: '#a5c422'
                                    }}>Health</span>
                                is Our Priority</h2>
                            <p>Providing top-notch medical treatments to help you live a healthy and
                                fulfilling life.</p>
                        </div>
                    </div>
                </Carousel.Item>
            </Carousel>

            {/* About Section */}
            <Container className="my-5" id='about-section'>
                <Row className="align-items-center">
                    <Col md={6}>
                        <img
                            src="/images/blog1.jpg"
                            alt="Medical team"
                            className="img-fluid rounded shadow"/>
                    </Col>
                    <Col md={6}>
                        <h2>About Us</h2>
                        <p>
                            Welcome to our healthcare platform. We are dedicated to providing exceptional
                            medical care and expertise to our patients. Our team of experienced and
                            qualified doctors works tirelessly to ensure your well-being and comfort.
                        </p>
                        <p>
                            Our mission is to bridge the gap between patients and top medical professionals.
                            With years of experience and advanced technology, we offer a seamless and
                            personalized healthcare experience.
                        </p>
                    </Col>
                </Row>
            </Container>

            {/* Doctor Cards Section */}
            <Container className="my-5" id='doctor-section'>
                <h2 className="text-center mb-4">Our Doctors</h2>

                {/* Search Bar */}
                <Form className="mb-4">
                    <Form.Control
                        type="text"
                        placeholder="Search by Department name"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}/>
                </Form>

                {/* Doctor Cards */}
                <Row>
                    {
                        currentItems.map((doctor) => (
                            <Col md={4} key={doctor.id} className="mb-4">
                                <Card className="shadow-lg border-0">
                                    {/* Check if the image exists and use full URL */}
                                    {
                                        doctor.image && (
                                            <Card.Img
                                                variant="top"
                                                src={`http://127.0.0.1:8000${doctor.image}`}
                                                alt={doctor.name}/>
                                        )
                                    }
                                    <Card.Body>
                                        <Card.Title>{doctor.name}</Card.Title>
                                        <Card.Text>
                                            <strong>Department:</strong>
                                            {doctor.department}<br/>
                                            <strong>Experience:</strong>
                                            {doctor.experience}
                                            years<br/>
                                            <strong>Qualification:</strong>
                                            {doctor.qualification}<br/>
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))
                    }

                </Row>

                {/* Pagination */}
                <Pagination className="justify-content-center mt-4 custom-pagination">
                    {
                        Array.from({
                            length: totalPages
                        }, (_, index) => (
                            <Pagination.Item
                                key={index + 1}
                                active={index + 1 === currentPage}
                                onClick={() => handlePageChange(index + 1)}>
                                {index + 1}
                            </Pagination.Item>
                        ))
                    }
                </Pagination>
            </Container>

            {/* Our Services Section */}
            <Container className="my-5" id='service-section'>
                <h2 className="text-center mb-4">Improve Your Health</h2>
                <p className="text-center mb-5">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec luctus dictum
                    eros ut imperdiet.
                </p>
                <Row className="text-center">
                    {/* Service 1 */}
                    <Col md={4} className="mb-4">
                        <Card className="border-0 shadow-lg p-4">
                            <Card.Body>
                                <FaClipboardList size={50} color="#a5c422"/>
                                <h5 className="mt-3">General Treatment</h5>
                                <p>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec luctus dictum
                                    eros ut imperdiet.
                                </p>
                            </Card.Body>
                        </Card>
                    </Col>

                    {/* Service 2 */}
                    <Col md={4} className="mb-4">
                        <Card className="border-0 shadow-lg p-4">
                            <Card.Body>
                                <FaTooth size={50} color="#a5c422"/>
                                <h5 className="mt-3">Dental Care</h5>
                                <p>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec luctus dictum
                                    eros ut imperdiet.
                                </p>
                            </Card.Body>
                        </Card>
                    </Col>

                    {/* Service 3 */}
                    <Col md={4} className="mb-4">
                        <Card className="border-0 shadow-lg p-4">
                            <Card.Body>
                                <FaHeartbeat size={50} color="#a5c422"/>
                                <h5 className="mt-3">Heart Surgery</h5>
                                <p>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec luctus dictum
                                    eros ut imperdiet.
                                </p>
                            </Card.Body>
                        </Card>
                    </Col>

                    {/* Service 4 */}
                    <Col md={4} className="mb-4">
                        <Card className="border-0 shadow-lg p-4">
                            <Card.Body>
                                <FaBrain size={50} color="#a5c422"/>
                                <h5 className="mt-3">Neural Treatment</h5>
                                <p>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec luctus dictum
                                    eros ut imperdiet.
                                </p>
                            </Card.Body>
                        </Card>
                    </Col>

                    {/* Service 5 */}
                    <Col md={4} className="mb-4">
                        <Card className="border-0 shadow-lg p-4">
                            <Card.Body>
                                <FaEye size={50} color="#a5c422"/>
                                <h5 className="mt-3">Vision Problems</h5>
                                <p>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec luctus dictum
                                    eros ut imperdiet.
                                </p>
                            </Card.Body>
                        </Card>
                    </Col>

                    {/* Service 6 */}
                    <Col md={4} className="mb-4">
                        <Card className="border-0 shadow-lg p-4">
                            <Card.Body>
                                <FaTint size={50} color="#a5c422"/>
                                <h5 className="mt-3">Blood Transfusion</h5>
                                <p>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec luctus dictum
                                    eros ut imperdiet.
                                </p>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>

            <Footer/>
        </div>
    );
}

export default HomePage;
