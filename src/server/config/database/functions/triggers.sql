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

        update discount_note set status_signature = 'RECHAZADO', status_dispatched = 'EXITOSO' where assignment_id = NEW.id and status_signature = 'PENDIENTE';
        update assignment_loan set status = 'INACTIVO' where assignment_id = NEW.id and status = 'ACTIVO';

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
