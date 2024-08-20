delimiter //
create function location_has_active_assignment(location_id varchar(255))
returns boolean
reads sql data
begin
    declare hasActiveAssignment boolean;

    select exists (
        select 1
        from slot where slot.location_id = location_id
                  and status = 'OCUPADO'
    ) into hasActiveAssignment;

    return hasActiveAssignment;
end;
delimiter ;
