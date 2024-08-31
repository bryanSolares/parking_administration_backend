--show variables like 'event_scheduler';
set global event_scheduler = on;

create event record_parking_occupancy
on schedule every 1 minute
starts current_timestamp
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
end;
