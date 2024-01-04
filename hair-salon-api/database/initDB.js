const getDB = require('./getDB');

async function main() {
  let connection;

  try {
    connection = await getDB();

    await connection.query('SET FOREIGN_KEY_CHECKS = 1');

    console.log('Eliminando tablas...');

    await connection.query(
      'drop table if exists appointments_schedule_services;'
    );
    await connection.query('drop table if exists appointments_schedule;');
    await connection.query('drop table if exists services;');
    await connection.query('drop table if exists hairdresser;');
    await connection.query('drop table if exists salon_images;');
    await connection.query('drop table if exists salon;');
    await connection.query('drop table if exists users;');

    console.log('Tablas eliminadas!');

    console.log('Creando tablas...');

    await connection.query(`create table if not exists users (
        id int unsigned primary key auto_increment,
        name varchar(200) not null,
        password varchar(255) not null,
        isAdmin bool default false,
        isHairdresser bool default false,
        createdAt timestamp default current_timestamp,
        avatar varchar(200)
    );`);

    await connection.query(`create table if not exists salon (
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
    );`);

    await connection.query(`create table if not exists salon_images (
        id int unsigned primary key auto_increment,
        name varchar(200) not null,
        idSalon int unsigned not null,
        foreign key (idSalon) references salon(id)
    );`);

    await connection.query(`create table if not exists hairdresser (
        id int unsigned primary key auto_increment,
        idUser int unsigned not null,
        idSalon int unsigned not null,
        foreign key (idUser) references users(id),
        foreign key (idSalon) references salon(id)
    );`);

    await connection.query(`create table if not exists services (
        id int unsigned primary key auto_increment,
        name varchar(160) not null,
        description varchar(200),
        price decimal(6, 2) not null,
        isVariablePrice bool default false,
        duration varchar(2),
        idSalon int unsigned not null,
        foreign key (idSalon) references salon(id)
    );`);

    await connection.query(`create table if not exists appointments_schedule (
        id int unsigned primary key auto_increment,
        date datetime not null,
        idUser int unsigned not null,
        idHairDresser int unsigned not null,
        idSalon int unsigned not null,
        foreign key (idUser) references users(id),
        foreign key (idHairDresser) references hairdresser(id),
        foreign key (idSalon) references salon(id)
    );`);

    await connection.query(`create table if not exists appointments_schedule_services (
        id int unsigned primary key auto_increment,
        idService int unsigned not null,
        idAppointments_schedule int unsigned not null,
        foreign key (idService) references services(id),
        foreign key (idAppointments_schedule) references appointments_schedule(id)
    );`);

    console.log('Tablas creadas!');
  } catch (error) {
    console.error(error);
  } finally {
    if (connection) connection.release();
    process.exit();
  }
}

main();
