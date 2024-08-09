--postgresql
create or replace function de_assignment_employee()
returns trigger
as
    $$
        begin
            update schedule set status = 'INACTIVO' where id = new.schedule_id;
            update assignment_loan set status = 'INACTIVO' where assignment_id = new.id;
            update slot set status = 'DISPONIBLE' where id = new.slot_id;
            return new;
        end;
    $$
language plpgsql;

create or replace trigger de_assignment_action
after
update on assignment for each row
when (old.status is distinct from new.status and new.status = 'INACTIVO')
execute function de_assignment_employee();

--mysql
DELIMITER //

CREATE TRIGGER de_assignment_action
AFTER UPDATE ON assignment
FOR EACH ROW
BEGIN
    IF OLD.status <> NEW.status AND NEW.status = 'INACTIVO' THEN
        UPDATE schedule SET status = 'INACTIVO' WHERE id = NEW.schedule_id;
        UPDATE assignment_loan SET status = 'INACTIVO' WHERE assignment_id = NEW.id;
        UPDATE slot SET status = 'DISPONIBLE' WHERE id = NEW.slot_id;
    END IF;
END //

DELIMITER ;

