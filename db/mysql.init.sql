
create table if not exists `location` (
  `id` char(36) character set utf8mb4 collate utf8mb4_bin not null,
  `name` varchar(255) not null,
  `address` varchar(255) not null,
  `contact_reference` varchar(255) default null,
  `phone` varchar(255) default null,
  `email` varchar(255) default null,
  `comments` varchar(255) default null,
  `number_of_identifier` varchar(255) not null,
  `status` enum('ACTIVO','INACTIVO') default 'ACTIVO',
  `created_at` datetime not null,
  `updated_at` datetime not null,
  `deleted_at` datetime default null,
  primary key (`id`),
  unique key `id` (`id`)
) engine=innodb default charset=utf8mb4 collate=utf8mb4_0900_ai_ci;


create table if not exists `slot` (
  `id` char(36) character set utf8mb4 collate utf8mb4_bin not null,
  `location_id` char(36) character set utf8mb4 collate utf8mb4_bin default null,
  `slot_number` varchar(255) not null,
  `slot_type` enum('SIMPLE','MULTIPLE') default 'SIMPLE',
  `limit_of_assignments` int not null default '1',
  `vehicle_type` enum('CARRO','MOTO','CAMION') default 'CARRO',
  `cost_type` enum('SIN_COSTO','DESCUENTO','COMPLEMENTO') default 'SIN_COSTO',
  `cost` float default '0',
  `status` enum('DISPONIBLE','OCUPADO','INACTIVO') default 'DISPONIBLE',
  `created_at` datetime not null,
  `updated_at` datetime not null,
  `deleted_at` datetime default null,
  primary key (`id`),
  unique key `id` (`id`),
  key `location_id` (`location_id`),
  constraint `slot_ibfk_1` foreign key (`location_id`) references `location` (`id`) on delete cascade on update cascade
) engine=innodb default charset=utf8mb4 collate=utf8mb4_0900_ai_ci;


CREATE TABLE `employee` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `employee_code` varchar(255) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `workplace` varchar(255) DEFAULT NULL,
  `identifier_document` varchar(255) DEFAULT NULL,
  `company` varchar(255) DEFAULT NULL,
  `department` varchar(255) DEFAULT NULL,
  `sub_management` varchar(255) DEFAULT NULL,
  `management1` varchar(255) DEFAULT NULL,
  `management2` varchar(255) DEFAULT NULL,
  `work_site` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `access_token` varchar(255) DEFAULT NULL,
  `access_token_status` enum('ACTIVO','INACTIVO') DEFAULT 'INACTIVO',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `employee_code` (`employee_code`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE `vehicle` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `employee_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `vehicle_badge` varchar(255) NOT NULL,
  `color` varchar(255) DEFAULT NULL,
  `brand` varchar(255) DEFAULT NULL,
  `model` varchar(255) DEFAULT NULL,
  `type` enum('CARRO','MOTO','CAMION') DEFAULT 'CARRO',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  KEY `employee_id` (`employee_id`),
  CONSTRAINT `vehicle_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employee` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE `assignment` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `slot_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `employee_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `parking_card_number` varchar(255) DEFAULT NULL,
  `benefit_type` enum('SIN_COSTO','DESCUENTO','COMPLEMENTO') NOT NULL,
  `assignment_date` date DEFAULT NULL,
  `form_decision_date` date DEFAULT NULL,
  `status` enum('ASIGNADO','EN_PROGRESO','CANCELADO','RECHAZADO','ACEPTADO','BAJA_AUTOMATICA','BAJA_MANUAL') DEFAULT 'ASIGNADO',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  KEY `slot_id` (`slot_id`),
  KEY `employee_id` (`employee_id`),
  CONSTRAINT `assignment_ibfk_1` FOREIGN KEY (`slot_id`) REFERENCES `slot` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `assignment_ibfk_2` FOREIGN KEY (`employee_id`) REFERENCES `employee` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE `assignment_loan` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `assignment_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `employee_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `start_date_assignment` date NOT NULL,
  `end_date_assignment` date NOT NULL,
  `assignment_date` date NOT NULL,
  `status` enum('ACTIVO','INACTIVO') NOT NULL DEFAULT 'ACTIVO',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  KEY `assignment_id` (`assignment_id`),
  KEY `employee_id` (`employee_id`),
  CONSTRAINT `assignment_loan_ibfk_1` FOREIGN KEY (`assignment_id`) REFERENCES `assignment` (`id`),
  CONSTRAINT `assignment_loan_ibfk_2` FOREIGN KEY (`employee_id`) REFERENCES `employee` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE `de_assignment` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `assignment_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `reason` varchar(255) NOT NULL,
  `de_assignment_date` date NOT NULL,
  `is_rpa_action` tinyint(1) DEFAULT '0',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  KEY `assignment_id` (`assignment_id`),
  CONSTRAINT `de_assignment_ibfk_1` FOREIGN KEY (`assignment_id`) REFERENCES `assignment` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE `discount_note` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `assignment_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `status_signature` enum('PENDIENTE','APROBADO','RECHAZADO','CANCELADO') DEFAULT 'PENDIENTE',
  `status_dispatched` enum('EXITOSO','FALLIDO','PENDIENTE','REINTENTANDO') DEFAULT 'PENDIENTE',
  `last_notice` datetime DEFAULT NULL,
  `next_notice` datetime DEFAULT NULL,
  `reminder_frequency` int DEFAULT '3',
  `dispatch_attempts` int DEFAULT '0',
  `max_dispatch_attempts` int DEFAULT '3',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  KEY `assignment_id` (`assignment_id`),
  CONSTRAINT `discount_note_ibfk_1` FOREIGN KEY (`assignment_id`) REFERENCES `assignment` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE `tag` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `status` enum('ACTIVO','INACTIVO') DEFAULT 'ACTIVO',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE `assignment_tag_detail` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `assignment_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `tag_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `assignment_tag_detail_assignmentId_tagId_unique` (`assignment_id`,`tag_id`),
  KEY `tag_id` (`tag_id`),
  CONSTRAINT `assignment_tag_detail_ibfk_1` FOREIGN KEY (`assignment_id`) REFERENCES `assignment` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `assignment_tag_detail_ibfk_2` FOREIGN KEY (`tag_id`) REFERENCES `tag` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE `parking_occupancy_trends` (
  `id` int NOT NULL AUTO_INCREMENT,
  `location_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `date` date NOT NULL,
  `total_slots` int NOT NULL,
  `available_slots` int NOT NULL,
  `unavailable_slots` int NOT NULL,
  `occupied_slots` int NOT NULL,
  `occupancy_rate` decimal(5,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `location_id` (`location_id`),
  CONSTRAINT `parking_occupancy_trends_ibfk_1` FOREIGN KEY (`location_id`) REFERENCES `location` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2886 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE `resource` (
  `id` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


create table if not exists `role` (
  `id` varchar(255) not null,
  `name` varchar(255) not null,
  `description` varchar(255) default null,
  `status` enum('ACTIVO','INACTIVO') not null default 'ACTIVO',
  `created_at` datetime not null,
  `updated_at` datetime not null,
  primary key (`id`)
) engine=innodb default charset=utf8mb4 collate=utf8mb4_0900_ai_ci;


create table if not exists `role_detail` (
  `role_id` varchar(255) not null,
  `resource_id` varchar(255) not null,
  `can_access` tinyint(1) default '0',
  `created_at` datetime not null,
  `updated_at` datetime not null,
  primary key (`role_id`,`resource_id`),
  unique key `role_detail_resource_id_role_id_unique` (`role_id`,`resource_id`),
  key `resource_id` (`resource_id`),
  constraint `role_detail_ibfk_1` foreign key (`role_id`) references `role` (`id`) on delete cascade on update cascade,
  constraint `role_detail_ibfk_2` foreign key (`resource_id`) references `resource` (`id`) on delete cascade on update cascade
) engine=innodb default charset=utf8mb4 collate=utf8mb4_0900_ai_ci;


CREATE TABLE `setting` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `setting_key` varchar(255) NOT NULL,
  `setting_value` varchar(500) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  UNIQUE KEY `setting_key` (`setting_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


create table if not exists `user` (
  `id` varchar(255) not null,
  `username` varchar(255) not null,
  `name` varchar(255) default null,
  `email` varchar(255) default null,
  `phone` varchar(255) default null,
  `password` varchar(255) default null,
  `role_id` varchar(255) default null,
  `status` enum('ACTIVO','INACTIVO') not null default 'ACTIVO',
  `created_at` datetime not null,
  `updated_at` datetime not null,
  primary key (`id`),
  key `role_id` (`role_id`),
  constraint `user_ibfk_1` foreign key (`role_id`) references `role` (`id`) on delete restrict on update restrict
) engine=innodb default charset=utf8mb4 collate=utf8mb4_0900_ai_ci;



delimiter ;;
create procedure if not exists `get_active_assignments_by_location`(in p_location_id varchar(255))
begin
	select
		s.id as slot_id,
		l.id as location_id,
		count(a.id) current_number_of_assignments,
		s.limit_of_assignments
	from
		`assignment` a
	inner join slot s on
		a.slot_id = s.id
	inner join location l on
		s.location_id = l.id
    where s.status = 'OCUPADO'
      and a.status in ('ASIGNADO', 'EN_PROGRESO', 'ACEPTADO')
		and l.id = p_location_id
	group by
		a.id;
end ;;
delimiter ;


delimiter ;;
create function if not exists `location_has_active_assignment`(location_id varchar(255))
returns tinyint(1)
reads sql data
begin
    declare hasactiveassignment boolean;

    select exists (
        select 1
        from slot where slot.location_id = location_id
                  and status = 'OCUPADO'
    ) into hasactiveassignment;

    return hasactiveassignment;
end ;;
delimiter ;


delimiter ;;
create function employee_has_an_active_assignment(emplo_id varchar(255))
returns boolean
reads sql data
begin
    declare hasassignment boolean;

    select exists (
        select 1
        from assignment a
        where a.employee_id = emplo_id
          and a.status in ('ASIGNADO', 'EN_PROGRESO', 'ACEPTADO')
        union all
        select 1
        from assignment_loan al
        where al.employee_id = emplo_id
          and al.status = 'ACTIVO'
    ) into hasassignment;

    return hasassignment;
end ;;
delimiter ;


delimiter ;;
create function can_create_more_assignments_in_slot(slt_id varchar(255))
returns boolean
reads sql data
begin
    declare assignments_allowed int;
    declare assignments_created int;

    select limit_of_assignments into assignments_allowed
    from slot
    where id = slt_id;

    select count(*) into assignments_created
    from `assignment` a
    where slot_id = slt_id and status not in ('BAJA_AUTOMATICA', 'BAJA_MANUAL', 'CANCELADO', 'RECHAZADO');

    if assignments_created < assignments_allowed then
        return true;
    else
        return false;
    end if;
end ;;
delimiter ;

delimiter ;;
create function get_active_assignments_by_slot(slotIdentifier varchar(255))
    returns integer
    reads sql data
begin
    declare counterAssignments int default 0;

    select count(*) into counterAssignments
    from assignment
             inner join slot on assignment.slot_id = slot.id
    where assignment.slot_id = slotIdentifier
      and assignment.status in ('ASIGNADO', 'EN_PROGRESO', 'ACEPTADO');

    return counterAssignments;
end;;
delimiter ;



delimiter ;;
create trigger in_change_slot_status_to_occupied
after insert on assignment
for each row
    begin
        update slot set status = 'OCUPADO' where id = NEW.slot_id;
    end ;;
delimiter ;



delimiter ;;
create trigger up_change_slot_status_to_available
    after update
    on assignment
    for each row
begin
    declare current_active_assignments integer;
    if (old.status != new.status AND new.status in ('CANCELADO', 'RECHAZADO', 'BAJA_MANUAL', 'BAJA_AUTOMATICA')) then
        select ifnull(count(*), 0)
        into current_active_assignments
        from assignment
        where slot_id = new.slot_id
          and status in ('ASIGNADO', 'EN_PROGRESO', 'ACEPTADO');

        if (current_active_assignments = 0) then
            update slot set status = 'DISPONIBLE' where id = new.slot_id;
        end if;

        update discount_note set status_signature = 'RECHAZADO', status_dispatched = 'EXITOSO' where assignment_id = NEW.id;
        update assignment_loan set status = 'INACTIVO' where assignment_id = NEW.id;

    end if;
end ;;
delimiter ;




delimiter ;;
create trigger in_change_status_assignment
before insert on de_assignment
for each row
    begin
        update assignment set status = 'BAJA_MANUAL' where id = NEW.assignment_id;
    end ;;
delimiter ;




create or replace view location_slot_summary as
select location_id,
       count(*)                                               as total_slots,
       sum(case when status = 'DISPONIBLE' then 1 else 0 end) as available_slots,
       sum(case when status = 'INACTIVO' then 1 else 0 end)   as unavailable_slots,
       sum(case when status = 'OCUPADO' then 1 else 0 end)    as occupied_slots
from slot where deleted_at is null
group by location_id;



set global event_scheduler = on;
delimiter ;;
create event record_parking_occupancy
on schedule every 24 hour
starts  concat(date_add(curdate(), interval 1 day), ' 00:00:00')
do
begin
    insert into parking_occupancy_trends(location_id, date, total_slots, available_slots, unavailable_slots, occupied_slots, occupancy_rate)
    select
        location_id,
        current_date(),
        nullif(total_slots, 0) as total_slots,
        nullif(available_slots, 0) as available_slots,
        nullif(unavailable_slots, 0) as unavailable_slots,
        nullif(occupied_slots, 0) as occupied_slots,
        round(((occupied_slots / nullif(total_slots, 0)) * 100),2) as occupancy_rate
    from location_slot_summary;
end ;;
delimiter ;

delimiter ;;
create event de_assignment_loan
on schedule every 24 hour
starts  concat(date_add(curdate(), interval 1 day), ' 00:00:00')
do
begin
    update assignment_loan set status = 'INACTIVO' where end_date_assignment = adddate(current_date, -1);
end ;;
delimiter ;

insert into `resource` values
('13a87ee9-5290-445b-8b6a-d2e5aea9eb8b','dashboard','main dashboard','2024-08-31 00:00:00','2024-08-31 00:00:00'),
('57cb7a57-019c-4605-a982-7f5776eb9531','parking-administrator','parking administrator','2024-08-31 00:00:00','2024-08-31 00:00:00');

INSERT INTO `setting` VALUES
('70d41c5d-488f-4852-81c8-e6d58c206335','MAX_DAYS_TO_ASSIGNMENT_LOAN','15','Máximo de días permitido para asignaciones temporales','2024-09-05 00:00:00','2024-09-05 00:00:00'),
('895b40e8-2fbf-4312-bd2e-15aa3ae96c82','WS_EMPLOYEES','https://jsonplaceholder.typicode.com/users','Web service','2024-08-13 00:00:00','2024-08-13 00:00:00'),
('bb9b8b5c-e42e-4995-8c13-177ee0f363b1','SIGNATURES_FOR_ACCEPTANCE_FORM','{\"security_boss\":{\"name\":\"securityBoss\",\"employee_code\":\"57123456789\"},\"parking_manager\":{\"name\":\"parkingManager\",\"employee_code\":\"57123456789\"},\"human_resources_manager\":{\"name\":\"humanResourcesManager\",\"employee_code\":\"57123456789\"},\"human_resources_payroll\":{\"name\":\"humanResourcesPayroll\",\"employee_code\":\"57123456789\"}}','Personal que firma formularios de aceptación','2024-09-03 00:00:00','2024-09-03 00:00:00');
