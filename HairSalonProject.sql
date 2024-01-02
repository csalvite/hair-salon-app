create database if not exists peluqueriaDB;

use peluqueriaDB;

create table if not exists users (
	id int unsigned primary key auto_increment,
    name varchar(200) not null,
    password varchar(255) not null,
    createdAt timestamp default current_timestamp,
    avatar varchar(200)
);

create table if not exists salon (
	id int unsigned primary key auto_increment,
    name varchar(200) not null,
    latitude varchar(255),
    longitude varchar(255)
);