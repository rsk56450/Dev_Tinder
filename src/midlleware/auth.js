const auth = (req, res, next) => {
    
    console.log("Auth middleware");
    
    const token = 'dsdfd';
    if(token === 'dsdfd'){
        next();
    }else{
        res.status(401).json({message: 'Unauthorized'});
    }
};

module.exports ={auth};