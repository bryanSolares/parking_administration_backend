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
