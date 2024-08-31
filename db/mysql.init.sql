
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


create table if not exists `employee` (
  `id` char(36) character set utf8mb4 collate utf8mb4_bin not null,
  `code_employee` varchar(255) not null,
  `name` varchar(255) not null,
  `workplace` varchar(255) default null,
  `identifier_document` varchar(255) default null,
  `company` varchar(255) default null,
  `department` varchar(255) default null,
  `sub_management` varchar(255) default null,
  `management_1` varchar(255) default null,
  `management_2` varchar(255) default null,
  `work_site` varchar(255) default null,
  `address` varchar(255) default null,
  `email` varchar(255) default null,
  `phone` varchar(255) default null,
  `access_token` varchar(255) default null,
  `access_token_status` enum('ACTIVO','INACTIVO') default 'INACTIVO',
  `created_at` datetime not null,
  `updated_at` datetime not null,
  primary key (`id`),
  unique key `code_employee` (`code_employee`),
  unique key `id` (`id`)
) engine=innodb default charset=utf8mb4 collate=utf8mb4_0900_ai_ci;


create table if not exists `vehicle` (
  `id` char(36) character set utf8mb4 collate utf8mb4_bin not null,
  `employee_id` char(36) character set utf8mb4 collate utf8mb4_bin not null,
  `vehicle_badge` varchar(255) not null,
  `color` varchar(255) default null,
  `brand` varchar(255) default null,
  `model` varchar(255) default null,
  `type` enum('CARRO','MOTO','CAMION') default 'CARRO',
  `created_at` datetime not null,
  `updated_at` datetime not null,
  primary key (`id`),
  unique key `id` (`id`),
  key `employee_id` (`employee_id`),
  constraint `vehicle_ibfk_1` foreign key (`employee_id`) references `employee` (`id`) on delete restrict on update restrict
) engine=innodb default charset=utf8mb4 collate=utf8mb4_0900_ai_ci;


create table if not exists `schedule` (
  `id` char(36) character set utf8mb4 collate utf8mb4_bin not null,
  `slot_id` char(36) character set utf8mb4 collate utf8mb4_bin not null,
  `start_time_assignment` time not null,
  `end_time_assignment` time not null,
  `status` enum('ACTIVO','INACTIVO') not null default 'ACTIVO',
  `created_at` datetime not null,
  `updated_at` datetime not null,
  primary key (`id`),
  unique key `id` (`id`),
  key `slot_id` (`slot_id`),
  constraint `schedule_ibfk_1` foreign key (`slot_id`) references `slot` (`id`) on delete restrict on update restrict
) engine=innodb default charset=utf8mb4 collate=utf8mb4_0900_ai_ci;


create table if not exists `assignment` (
  `id` char(36) character set utf8mb4 collate utf8mb4_bin not null,
  `slot_id` char(36) character set utf8mb4 collate utf8mb4_bin default null,
  `employee_id` char(36) character set utf8mb4 collate utf8mb4_bin default null,
  `assignment_date` datetime default null,
  `schedule_id` char(36) character set utf8mb4 collate utf8mb4_bin default null,
  `status` enum('ACTIVO','INACTIVO') default 'ACTIVO',
  `created_at` datetime not null,
  `updated_at` datetime not null,
  primary key (`id`),
  unique key `id` (`id`),
  key `slot_id` (`slot_id`),
  key `employee_id` (`employee_id`),
  key `schedule_id` (`schedule_id`),
  constraint `assignment_ibfk_1` foreign key (`slot_id`) references `slot` (`id`) on delete restrict on update restrict,
  constraint `assignment_ibfk_2` foreign key (`employee_id`) references `employee` (`id`) on delete restrict on update restrict,
  constraint `assignment_ibfk_3` foreign key (`schedule_id`) references `schedule` (`id`) on delete restrict on update restrict
) engine=innodb default charset=utf8mb4 collate=utf8mb4_0900_ai_ci;


create table if not exists `assignment_loan` (
  `id` char(36) character set utf8mb4 collate utf8mb4_bin not null,
  `assignment_id` char(36) character set utf8mb4 collate utf8mb4_bin not null,
  `employee_id` char(36) character set utf8mb4 collate utf8mb4_bin not null,
  `start_date_assignment` date not null,
  `end_date_assignment` date not null,
  `assignment_date` date not null,
  `status` enum('ACTIVO','INACTIVO') not null default 'ACTIVO',
  `created_at` datetime not null,
  `updated_at` datetime not null,
  primary key (`id`),
  unique key `id` (`id`),
  key `assignment_id` (`assignment_id`),
  key `employee_id` (`employee_id`),
  constraint `assignment_loan_ibfk_1` foreign key (`assignment_id`) references `assignment` (`id`) on delete restrict on update restrict,
  constraint `assignment_loan_ibfk_2` foreign key (`employee_id`) references `employee` (`id`) on delete restrict on update restrict
) engine=innodb default charset=utf8mb4 collate=utf8mb4_0900_ai_ci;


create table if not exists `de_assignment` (
  `id` char(36) character set utf8mb4 collate utf8mb4_bin not null,
  `assignment_id` char(36) character set utf8mb4 collate utf8mb4_bin not null,
  `reason` varchar(255) not null,
  `de_assignment_date` datetime not null,
  `is_rpa_action` tinyint(1) default '0',
  `created_at` datetime not null,
  `updated_at` datetime not null,
  primary key (`id`),
  unique key `id` (`id`)
) engine=innodb default charset=utf8mb4 collate=utf8mb4_0900_ai_ci;


create table if not exists `discount_note` (
  `id` char(36) character set utf8mb4 collate utf8mb4_bin not null,
  `assignment_id` char(36) character set utf8mb4 collate utf8mb4_bin not null,
  `status_signature` enum('PENDIENTE','APROBADO','RECHAZADO','CANCELADO') default 'PENDIENTE',
  `status_dispatched` enum('EXITOSO','FALLIDO','PENDIENTE','REINTENTANDO') default 'PENDIENTE',
  `last_notice` datetime default null,
  `next_notice` datetime default null,
  `reminder_frequency` int default '2',
  `dispatch_attempts` int default '0',
  `max_dispatch_attempts` int default '3',
  `created_at` datetime not null,
  `updated_at` datetime not null,
  primary key (`id`),
  unique key `id` (`id`),
  key `assignment_id` (`assignment_id`),
  constraint `discount_note_ibfk_1` foreign key (`assignment_id`) references `assignment` (`id`) on delete restrict on update restrict
) engine=innodb default charset=utf8mb4 collate=utf8mb4_0900_ai_ci;


create table if not exists `tag` (
  `id` char(36) character set utf8mb4 collate utf8mb4_bin not null,
  `name` varchar(255) not null,
  `description` varchar(255) default null,
  `status` enum('ACTIVO','INACTIVO') default 'ACTIVO',
  `created_at` datetime not null,
  `updated_at` datetime not null,
  primary key (`id`),
  unique key `id` (`id`)
) engine=innodb default charset=utf8mb4 collate=utf8mb4_0900_ai_ci;


create table if not exists `assignment_tag_detail` (
  `id` char(36) character set utf8mb4 collate utf8mb4_bin not null,
  `assignment_id` char(36) character set utf8mb4 collate utf8mb4_bin not null,
  `tag_id` char(36) character set utf8mb4 collate utf8mb4_bin not null,
  `created_at` datetime not null,
  `updated_at` datetime not null,
  `tagid` char(36) character set utf8mb4 collate utf8mb4_bin default null,
  `assignmentid` char(36) character set utf8mb4 collate utf8mb4_bin default null,
  primary key (`id`),
  unique key `assignment_tag_detail_tagid_assignmentid_unique` (`tagid`,`assignmentid`),
  key `assignment_id` (`assignment_id`),
  key `tag_id` (`tag_id`),
  key `assignmentid` (`assignmentid`),
  constraint `assignment_tag_detail_ibfk_1` foreign key (`assignment_id`) references `assignment` (`id`),
  constraint `assignment_tag_detail_ibfk_2` foreign key (`tag_id`) references `tag` (`id`),
  constraint `assignment_tag_detail_ibfk_3` foreign key (`tagid`) references `tag` (`id`) on delete cascade on update cascade,
  constraint `assignment_tag_detail_ibfk_4` foreign key (`assignmentid`) references `assignment` (`id`) on delete cascade on update cascade
) engine=innodb default charset=utf8mb4 collate=utf8mb4_0900_ai_ci;


create table if not exists `parking_occupancy_trends` (
  `id` int not null auto_increment,
  `location_id` char(36) character set utf8mb4 collate utf8mb4_bin not null,
  `date` date not null,
  `total_slots` int not null,
  `available_slots` int not null,
  `unavailable_slots` int not null,
  `occupied_slots` int not null,
  `occupancy_rate` decimal(5,2) not null,
  primary key (`id`),
  key `location_id` (`location_id`),
  constraint `parking_occupancy_trends_ibfk_1` foreign key (`location_id`) references `location` (`id`)
) engine=innodb default charset=utf8mb4 collate=utf8mb4_0900_ai_ci;


create table if not exists `resource` (
  `id` varchar(255) not null,
  `slug` varchar(255) not null,
  `description` varchar(255) not null,
  `created_at` datetime not null,
  `updated_at` datetime not null,
  primary key (`id`)
) engine=innodb default charset=utf8mb4 collate=utf8mb4_0900_ai_ci;


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


create table if not exists `setting` (
  `id` char(36) character set utf8mb4 collate utf8mb4_bin not null,
  `setting_key` varchar(255) not null,
  `setting_value` varchar(255) not null,
  `description` varchar(255) default null,
  `created_at` datetime not null,
  `updated_at` datetime not null,
  primary key (`id`),
  unique key `id` (`id`),
  unique key `setting_key` (`setting_key`)
) engine=innodb default charset=utf8mb4 collate=utf8mb4_0900_ai_ci;


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
create function if not exists `location_has_active_assignment`(location_id varchar(255)) returns tinyint(1)
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
	where
		s.status = 'OCUPADO'
		and a.status = 'ACTIVO'
		and l.id = p_location_id
	group by
		a.id;
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
on schedule every 1 minute
starts current_timestamp
do
begin
    insert into parking_occupancy_trends(location_id, date, total_slots, available_slots, unavailable_slots, occupied_slots, occupancy_rate)
    select
        location_id,
        current_date(),
        ifnull(total_slots, 0) as total_slots,
        ifnull(available_slots, 0) as available_slots,
        ifnull(unavailable_slots, 0) as unavailable_slots,
        ifnull(occupied_slots, 0) as occupied_slots,
        ifnull(round(((occupied_slots / ifnull(total_slots, 0)) * 100),2),0) as occupancy_rate
    from location_slot_summary;
end ;;
delimiter ;

insert into `resource` values
('13a87ee9-5290-445b-8b6a-d2e5aea9eb8b','dashboard','main dashboard','2024-08-31 00:00:00','2024-08-31 00:00:00'),
('57cb7a57-019c-4605-a982-7f5776eb9531','parking-administrator','parking administrator','2024-08-31 00:00:00','2024-08-31 00:00:00');

INSERT INTO `setting` VALUES
('895b40e8-2fbf-4312-bd2e-15aa3ae96c82','WS_EMPLOYEES','https://jsonplaceholder.typicode.com/users','Web service','2024-08-13 00:00:00','2024-08-13 00:00:00');
