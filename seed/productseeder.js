var Product =require('../models/product');
var mongoose =require('mongoose');
mongoose.connect('mongodb://localhost:27017/shopping');

var products=[
    new Product({
        imagePath: 'https://i.ytimg.com/vi/kr05reBxVRs/maxresdefault.jpg',
        title: 'Pepper',
        description:'Pepper is a semi-humanoid robot manufactured by SoftBank Robotics , which is owned by SoftBank, designed with the ability to read emotions. ',
        price: 36000
    }),
    new Product({
        imagePath: 'https://pbs.twimg.com/profile_images/927911465851506694/kbokWJhU_400x400.jpg',
        title: 'Sophia',
        description:'Sophia is a social humanoid robot developed by Hong Kong-based company Hanson Robotics.Sophia became the first robot to receive citizenship of any country.',
        price: 44900
    }),
    new Product({
        imagePath: 'http://media.bizj.us/view/img/8274512/r4stinymilo*750xx184-245-0-0.jpg',
        title: 'Milobot',
        description:'Milo is a humanoid robot designed to teach social skills to children with autism. He has an autism specific curriculum that is interactive, engaging and fun. ',
        price: 22000
    }),
    new Product({
        imagePath: 'http://www.robots.nu/assets/Robot-categorie/_resampled/resizedimage475458-Zorgrobot-robot-voor-zorgtaken.jpg',
        title: 'Robear',
        description:'Robear is a nursing-care robot developed by the RIKEN-SRK in Japan. The idea behind the robot was to help people, particularly the elderly,regain independence.',
        price: 252000
    }),
    new Product({
        imagePath: 'https://www.bostondynamics.com/sites/default/files/styles/max_1300x1300/public/2018-03/MPM_0258.jpg?itok=aKn4tRZ8',
        title: 'SpotMini',
        description:'SpotMini is a small four-legged robot that handles objects, climbs stairs, and will operate in offices, homes and outdoors. It inherits its big brother Spot',
        price: 24000
    }),
    new Product({
        imagePath: 'https://ksassets.timeincuk.net/wp/uploads/sites/54/2016/04/jibo-3.jpg',
        title: 'Jibo',
        description:'Robot that can organise your home office and ensure your children are ready for school.Jibo is an excellent example of how robots can become our personal assistants.',
        price: 749
    }),
    new Product({
        imagePath: 'https://ksassets.timeincuk.net/wp/uploads/sites/54/2016/04/double-3.jpg',
        title: 'Double',
        description:'Double is essentially a stick with motorised wheels and a screen attached to it, letting you move around spaces and attend events from the comfort of your own home',
        price: 2000
    }),
    new Product({
        imagePath: 'https://ksassets.timeincuk.net/wp/uploads/sites/54/2016/04/deka-3.jpg',
        title: 'Deka',
        description:'Bionic limbs have also emerged as an exciting area of robotic technology – aiding people who’ve been born without limbs or who’ve lost them in accidents. ',
        price: 2000
    }),
    new Product({
        imagePath: 'https://ksassets.timeincuk.net/wp/uploads/sites/54/2016/04/lgbot-3.jpg',
        title: 'Rollbot',
        description:'LG’s Rolling Bot could be set to revolutionise your home. Styled like the BB-8 Droid, it’s a Wi-Fi-based security bot that you can roll around your house remotely.',
        price: 1000
    }),
    

    
];
var done=0;
for(var i=0;i<products.length;i++){
    products[i].save(function(err,result){
        done++;
        if(done===products.length){
            exit();
        }});
    }
    function exit(){
        mongoose.disconnect();
    }
