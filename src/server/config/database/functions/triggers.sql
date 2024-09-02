delimiter ;;
create trigger change_slot_status
after insert on assignment
for each row
    begin
        update slot set status = 'OCUPADO' where id = NEW.slot_id;
    end;;
delimiter ;
