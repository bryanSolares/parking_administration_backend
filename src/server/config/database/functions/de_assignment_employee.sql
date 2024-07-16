create or replace function de_assignment_employee()
returns trigger
as
    $$
        begin
            update schedule set status = 'INACTIVO' where id = new.schedule_id;
            update assignment_loan set status = 'INACTIVO' where assignment_id = new.id;
            return new;
        end;
    $$
language plpgsql;

create or replace trigger de_assignment_action
after
update on assignment for each row
when (old.status is distinct from new.status)
execute function de_assignment_employee();
