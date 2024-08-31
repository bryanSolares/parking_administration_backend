create view location_slot_summary as
select location_id,
       count(*)                                               as total_slots,
       sum(case when status = 'disponible' then 1 else 0 end) as available_slots,
       sum(case when status = 'inactivo' then 1 else 0 end)   as unavailable_slots,
       sum(case when status = 'ocupado' then 1 else 0 end)    as occupied_slots
from slot
group by location_id;
