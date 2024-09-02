delimiter //
create procedure get_active_assignments_by_location(in p_location_id varchar(255))
begin
    select s.id as     slot_id,
           l.id as     location_id,
           count(a.id) current_number_of_assignments,
           s.limit_of_assignments
    from `assignment` a
             inner join slot s on
        a.slot_id = s.id
             inner join location l on
        s.location_id = l.id
    where s.status = 'ocupado'
      and a.status = 'activo'
      and l.id = p_location_id
    group by a.id;
end;
delimiter ;


delimiter //
create function location_has_active_assignment(location_id varchar(255))
    returns boolean
    reads sql data
begin
    declare hasactiveassignment boolean;

    select exists (select 1
                   from slot
                   where slot.location_id = location_id
                     and status = 'ocupado')
    into hasactiveassignment;

    return hasactiveassignment;
end;
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
          and a.status in ('CREADO', 'EN_PROGRESO', 'ACTIVO')
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
    where slot_id = slt_id and status not in ('baja_automatica', 'baja_manual', 'cancelado');

    if assignments_created < assignments_allowed then
        return true;
    else
        return false;
    end if;
end ;;
delimiter ;
