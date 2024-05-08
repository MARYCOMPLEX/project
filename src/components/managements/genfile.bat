@echo off
setlocal

rem List of vue file names based on the routing commands
set FILES=security_equipment_management administrator_information_management building_management building_cold_water_meter_management building_hot_water_meter_management access_control_management camera_management dormitory_management dormitory_electricity_meter_management dormitory_cold_water_meter_management dormitory_hot_water_meter_management student_information_management

rem Create empty .vue files for each item in the list
for %%f in (%FILES%) do (
    echo Creating empty Vue file: %%f.vue
    type NUL > %%f.vue
)

echo All files created.
pause
