import moment from 'moment';

export default class Order{
    constructor(id, orderItems, amount, date){
        this.id = id;
        this.orderItems = orderItems;
        this.amount = amount;
        this.date = date;
    }

    get readableDate (){
        return moment(this.date).format('MMM Do YYYY, hh:mm');
    } 
}