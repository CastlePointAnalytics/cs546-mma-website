let form = document.getElementById('fightSelection');
let dropDown = document.getElementById('fightsDropdown');
let upcomingDiv = document.getElementById('upcoming');
let pastDiv = document.getElementById('past');

if(form){
    form.addEventListener('submit', (event)=>{
        event.preventDefault();
        let selectedFight =  dropDown.options[dropDown.selectedIndex].value;
        if(selectedFight==='past'){
            upcomingDiv.hidden = true;
            pastDiv.hidden = false;
        }else if(selectedFight==='upcoming'){
            pastDiv.hidden = true;
            upcomingDiv.hidden = false;
        }else{
            pastDiv.hidden = true;
            upcomingDiv.hidden = true;
        }
        form.reset();
    });
}