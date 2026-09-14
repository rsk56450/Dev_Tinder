const cron = require('node-cron');
const { subDays, startOfDay, endOfDay } = require('date-fns');
const ConnectionRequest = require('../config/models/connectionRequest');

cron.schedule('0 8 * * *', async () => {
    try {
        const yesterday = subDays(new Date(), 1);
        const yesterdayStart = startOfDay(yesterday);
        const yesterdayEnd = endOfDay(yesterday);

       const pendingConnectionRequests = await ConnectionRequest.find({
            status: 'intrested',
            createdAt: {
                $gte: yesterdayStart,
                $lte: yesterdayEnd,
            },
       }).populate('fromUserId toUserId');
        
        const listOfUsers = [...new Set(pendingConnectionRequests.map(request => request.toUserId.email))];
        
        
    } catch (error) {
        console.log(error);
    }
    console.log('Cron job executed', new Date().toISOString());
});