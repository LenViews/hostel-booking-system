CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,

    name VARCHAR(100) NOT NULL,

    email VARCHAR(100)
    UNIQUE NOT NULL,

    password_hash TEXT NOT NULL,

    role ENUM(
        'student',
        'admin'
    ) DEFAULT 'student',

    created_at TIMESTAMP
    DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE hostels (
    id INT AUTO_INCREMENT PRIMARY KEY,

    name VARCHAR(100) NOT NULL,

    location TEXT,

    description TEXT,

    created_at TIMESTAMP
    DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE rooms (
    id INT AUTO_INCREMENT PRIMARY KEY,

    hostel_id INT NOT NULL,

    room_number VARCHAR(20) NOT NULL,

    capacity INT NOT NULL,

    price DECIMAL(10,2),

    image_url TEXT,

    status ENUM(
        'available',
        'occupied',
        'maintenance'
    ) DEFAULT 'available',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (hostel_id)
        REFERENCES hostels(id)
        ON DELETE CASCADE
);


CREATE TABLE bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,

    user_id INT NOT NULL,

    room_id INT NOT NULL,

    check_in_date DATE NOT NULL,

    check_out_date DATE NOT NULL,

    status ENUM(
        'pending',
        'confirmed',
        'cancelled'
    ) DEFAULT 'confirmed',

    created_at TIMESTAMP
    DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE,

    FOREIGN KEY (room_id)
    REFERENCES rooms(id)
    ON DELETE CASCADE
);
