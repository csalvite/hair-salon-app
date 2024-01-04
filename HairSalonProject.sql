/*
	################################################
    ### Script creación base de datos peluqueria ###
    ################################################
    
    Es una primera versión pensada únicamente para ser usada por una única peluquería,
    por eso encontramos relaciones entre tablas de 1:N en vez de ser un N:M por ejemplo.
    
    Más adelante si se da el caso de convertir a una aplicación más grande que pueda albergar varias
    peluquerías con varios empleados usaríamos otro tipo de distribución de las tablas en la bbdd.
*/

create database if not exists peluqueriaDB;

-- drop database peluqueriaDB;

use peluqueriaDB;

drop table if exists appointments_schedule_services;
drop table if exists appointments_schedule;
drop table if exists services;
drop table if exists hairdresser;
drop table if exists salon_images;
drop table if exists salon;
drop table if exists users;

create table if not exists users (
	id int unsigned primary key auto_increment,
    name varchar(200) not null,
    password varchar(255) not null,
    email varchar(255) not null,
    isAdmin bool default false,
    isHairdresser bool default false,
    createdAt timestamp default current_timestamp,
    avatar varchar(200)
);

create table if not exists salon (
	id int unsigned primary key auto_increment,
    name varchar(200) not null,
    description varchar(1200),
    location varchar(100) not null,
    phone char(9),
    email varchar(200),
    schedule varchar(200) default "Abierto de Lunes a Sábado",
    latitude varchar(255),
    longitude varchar(255),
    idUserAdmin int unsigned not null,
    foreign key (idUserAdmin) references users(id)
);

create table if not exists salon_images (
	id int unsigned primary key auto_increment,
    name varchar(200) not null,
    idSalon int unsigned not null,
    foreign key (idSalon) references salon(id)
);

create table if not exists hairdresser (
	id int unsigned primary key auto_increment,
    idUser int unsigned not null,
    idSalon int unsigned not null,
    foreign key (idUser) references users(id),
    foreign key (idSalon) references salon(id)
);

create table if not exists services (
	id int unsigned primary key auto_increment,
    name varchar(160) not null,
    description varchar(200),
    price decimal(6, 2) not null,
    isVariablePrice bool default false,
    duration varchar(2),
    idSalon int unsigned not null,
    foreign key (idSalon) references salon(id)
);

create table if not exists appointments_schedule (
	id int unsigned primary key auto_increment,
    date datetime not null,
    idUser int unsigned not null,
    idHairDresser int unsigned not null,
    idSalon int unsigned not null,
    foreign key (idUser) references users(id),
    foreign key (idHairDresser) references hairdresser(id),
    foreign key (idSalon) references salon(id)
);

-- como uno o más servicios pueden pertenecer a una o más citas
create table if not exists appointments_schedule_services (
	id int unsigned primary key auto_increment,
    idService int unsigned not null,
    idAppointments_schedule int unsigned not null,
    foreign key (idService) references services(id),
    foreign key (idAppointments_schedule) references appointments_schedule(id)
);

show tables;
