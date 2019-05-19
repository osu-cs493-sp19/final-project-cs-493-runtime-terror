-- phpMyAdmin SQL Dump
-- version 4.8.5
-- https://www.phpmyadmin.net/
--
-- Host: mysql
-- Generation Time: May 19, 2019 at 12:51 AM
-- Server version: 5.7.26
-- PHP Version: 7.2.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `Tarpaulin`
--

-- --------------------------------------------------------

--
-- Table structure for table `assignments`
--

CREATE TABLE `assignments` (
  `id` int(11) NOT NULL,
  `course_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `points` int(11) NOT NULL,
  `due_date` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `assignments`
--

INSERT INTO `assignments` (`id`, `course_id`, `title`, `points`, `due_date`) VALUES
(1, 1, 'Assignment-1', 100, '2019-04-22 23:59:00'),
(2, 1, 'Assignment-2', 100, '2019-05-06 23:59:00'),
(3, 1, 'Assignment-3', 100, '2019-05-20 23:59:00'),
(4, 2, 'Programing Assignment 1', 50, '2019-04-10 17:00:00'),
(5, 2, 'Programing Assignment 2', 50, '2019-05-03 17:00:00'),
(6, 2, 'Programing Assignment 3', 50, '2019-06-03 17:00:00'),
(7, 3, 'Assignment 1', 100, '2019-04-12 23:59:59'),
(8, 3, 'Assignment 2', 100, '2019-04-24 23:59:59'),
(9, 3, 'Assignment 3', 80, '2019-05-14 23:59:59'),
(10, 3, 'Assignment 4', 100, '2019-05-28 23:59:59'),
(11, 4, 'Quiz 1', 10, '2019-01-22 00:00:00'),
(12, 4, 'Quiz 2', 10, '2019-02-22 00:00:00'),
(13, 4, 'Quiz 3', 10, '2019-04-26 00:00:00'),
(14, 5, 'History in a box Application', 25, '2018-04-13 00:00:00'),
(15, 5, 'Simulation 1-4', 100, '2018-05-04 00:00:00'),
(16, 5, 'History in a Box: Interior', 50, '2018-06-02 00:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `courses`
--

CREATE TABLE `courses` (
  `id` int(11) NOT NULL,
  `subject` varchar(11) NOT NULL,
  `number` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `term` varchar(11) NOT NULL,
  `instructor_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `courses`
--

INSERT INTO `courses` (`id`, `subject`, `number`, `title`, `term`, `instructor_id`) VALUES
(1, 'CS', 493, 'Cloud Application Development', 'sp19', 1),
(2, 'CS', 331, 'Intro to Artificial Intelligence', 'sp19', 2),
(3, 'CS', 434, 'Machine Learning & Data Mining ', 'sp19', 3),
(4, 'HST', 104, 'World History: Ancient Civilizations', 'w19', 4),
(5, 'HST', 201, 'History of the United States', 's18', 4);

-- --------------------------------------------------------

--
-- Table structure for table `course_enrollment`
--

CREATE TABLE `course_enrollment` (
  `student_id` int(11) NOT NULL,
  `course_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `course_enrollment`
--

INSERT INTO `course_enrollment` (`student_id`, `course_id`) VALUES
(10, 1),
(11, 1),
(12, 1),
(13, 2),
(13, 2),
(14, 2),
(15, 3),
(16, 3),
(17, 4),
(18, 4),
(19, 5),
(20, 5),
(21, 5);

-- --------------------------------------------------------

--
-- Table structure for table `submissions`
--

CREATE TABLE `submissions` (
  `id` int(11) NOT NULL,
  `course_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `file` blob NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` text NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`) VALUES
(1, 'Rob Hess', 'hess@mail.com', 'hunter2', 'instructor'),
(2, 'Rebecca Hutchinson', 'hutchinson@mail.com', 'hunter2', 'instructor'),
(3, 'Xiaoli Fern', 'fern@mail.com', 'hunter2', 'instructor'),
(4, 'Kendall Staggs', 'staggs@mail.com', 'hunter2', 'instructor'),
(5, 'Steve Shay', 'shay@mail.com', 'hunter2', 'instructor'),
(6, 'Ethan Patterson', 'patterson@mail.com', 'hunter2', 'admin'),
(7, 'Garret Haley', 'haley@mail.com', 'hunter2', 'admin'),
(8, 'Alea Weeks', 'weeks@mail.com', 'hunter2', 'admin'),
(9, 'Daniel Domme', 'Domme@mail.com', 'hunter2', 'admin'),
(10, 'Madyson Osborne', 'osborne@mail.com', 'hunter2', 'student'),
(11, 'Julius Reilly', 'reilly@mail.com', 'hunter2', 'student'),
(12, 'Milagros Daniel', 'daniel@mail.com', 'hunter2', 'student'),
(13, 'Patricia Mccoy', 'mccoy@mail.com', 'hunter2', 'student'),
(14, 'Kymani Hobbs', 'hobbs@mail.com', 'hunter2', 'student'),
(15, 'Kole Clarke', 'clarke@mail.com', 'hunter2', 'student'),
(16, 'Judah Higgins', 'higgins@mail.com', 'hunter2', 'student'),
(17, 'Max Daniel', 'mdaniel@mail.com', 'hunter2', 'student'),
(18, 'Zariah Hensley', 'hensley@mail.com', 'hunter2', 'student'),
(19, 'Piper Sweeney', 'sweeney@mail.com', 'hunter2', 'student'),
(20, 'Dax Hart', 'hart@mail.com', 'hunter2', 'student'),
(21, 'Ernest Livingston', 'livingston@mail.com', 'hunter2', 'student');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `assignments`
--
ALTER TABLE `assignments`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `courses`
--
ALTER TABLE `courses`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `submissions`
--
ALTER TABLE `submissions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `assignments`
--
ALTER TABLE `assignments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `courses`
--
ALTER TABLE `courses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `submissions`
--
ALTER TABLE `submissions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
