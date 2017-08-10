/*
 * permissions.js
 * Script that handles all permissions.
 */
(function() {
    var users = [];

    /*
     * @class User
     *
     * @param {String}  username
     * @param {Boolean} hasMode
     * @param {Number}  group
     */
    function User(username, hasMode, group) {
        this.username = username;
        this.group = group;
    }

    /*
     * @function getUser
     *
     * @param  {String} username
     * @return {Object}
     */
    function getUser(username) {
        return users[username.toLowerCase()];
    }

    /*
     * @function getUsers
     *
     * @return {Array}
     */
    function getUsers() {
        return Object.keys(users);
    }

    /*
     * @function getSetUser
     *
     * @param  {String} username
     * @return {Object}
     */
    function getSetUser(username) {
        var user = getUser(username);

        if (user === undefined) {
            users[username] = new User(username, false, $.getIniDbNumber('group', username, 7));
        }
        return users[username];
    }

    /*
     * @function userExists
     *
     * @param {String} username
     */
    function userExists(username) {
        return getUser(username) !== undefined;
    }

    /*
     * @function isBot
     *
     * @param  {String} username
     * @return {Boolean}
     */
    function isBot(username) {
        var user = getUser(username);

        return (user !== undefined && user.username == $.botName);
    }

    /*
     * @function isOwner
     *
     * @param  {String} username
     * @return {Boolean}
     */
    function isOwner(username) {
        var user = getUser(username);

        return (user !== undefined && user.username == $.ownerName);
    }

    /*
     * @function isCaster
     *
     * @param  {String} username
     * @return {Boolean}
     */
    function isCaster(username) {
        var user = getUser(username);

        return (user !== undefined && user.username == $.channelName);
    }

    /*
     * @function isAdmin
     *
     * @param  {String} username
     * @return {Boolean}
     */
    function isAdmin(username) {
        var user = getUser(username);

        return (user !== undefined && user.group <= 1);
    }

    /*
     * @function isMod
     *
     * @param  {String} username
     * @param  {Object} tags
     * @return {Boolean}
     */
    function isMod(username, tags) {
        var user = getUser(username);

        return ((tags !== undefined && tags.get('user-type').length() > 0) || (user !== undefined && user.group <= 2));
    }

    /*
     * @function isSub
     *
     * @param  {String} username
     * @param  {Object} tags
     * @return {Boolean}
     */
    function isSub(username, tags) {
        var user = getUser(username);

        return ((tags !== undefined && tags.get('subscriber') == '1') || (user !== undefined && user.group === 3));
    }

    /*
     * @function isDonator
     *
     * @param  {String} username
     * @return {Boolean}
     */
    function isDonator(username) {
        var user = getUser(username);

        return (user !== undefined && user.group === 4);
    }

    /*
     * @function isReg
     *
     * @param  {String} username
     * @return {Boolean}
     */
    function isReg(username) {
        var user = getUser(username);

        return (user !== undefined && user.group <= 6);
    }

    /*
     * @function getUserGroupId
     *
     * @param  {String} username
     * @return {Number}
     */
    function getUserGroupId(username) {
        var user = getUser(username);

        return (user !== undefined ? user.group : 7);
    }

    /*
     * @function getUserGroupName
     *
     * @param  {String} username
     * @return {String}
     */
    function getUserGroupName(username) {
        var user = getUser(username);

        return (user !== undefined ? getGroupNameById(user.group) : getGroupNameById(7));
    }

    /*
     * @function getGroupNameById
     *
     * @param  {Number} id
     * @return {String}
     */
    function getGroupNameById(id) {
        switch (parseInt(id)) {
            case 0:
                return 'Caster';
            case 1:
                return 'Administrator';
            case 2:
                return 'Moderator';
            case 3:
                return 'Subscriber';
            case 4:
                return 'Donator';
            case 5:
                return 'Hoster';
            case 6:
                return 'Regular';
            default:
                return 'Viewer';
        }
    }

    /*
     * @function getGroupIdByName
     *
     * @param  {String} group
     * @return {Number}
     */
    function getGroupIdByName(group) {
        switch (group) {
            case 'Caster':
                return 0;
            case 'Administrator':
                return 1;
            case 'Moderator':
                return 2;
            case 'Subscriber':
                return 3;
            case 'Donator':
                return 4;
            case 'Hoster':
                return 5;
            case 'Regular':
                return 6;
            default:
                return 7;
        }
    }

    /*
     * @function getGroupPointMultiplier
     *
     * @param  {String} username
     * @return {Number}
     */
    function getGroupPointMultiplier(username) {
        return $.getIniDbNumber('grouppoints', getUserGroupName(username), 1);
    }

    /*
     * @function setUserGroupById
     *
     * @param  {String} username
     * @param  {Number} id
     */
    function setUserGroupById(username, id) {
        var user = getSetUser(username);

        id = (id > 7 || id < 0 ? 7 : id);

        user.group = id;

        $.setIniDbNumber('group', username, id);
    }

    /*
     * @function setUserGroupByIdIfExists
     *
     * @param  {String} username
     * @param  {Number} id
     */
    function setUserGroupByIdIfExists(username, id) {
        var user = getSetUser(username);

        if ($.inidb.exists('group', username)) {
            id = (id > 7 || id < 0 ? 7 : id);
    
            user.group = id;
    
            $.setIniDbNumber('group', username, id);
        }
    }

    /*
     * @function setUserGroupByIdIfNotMod
     *
     * @param  {String} username
     * @param  {Number} id
     * @param  {Object} tags
     */
    function setUserGroupByIdIfNotMod(username, id, tags) {
        var user = getSetUser(username);

        if (user.group < 2) {
            id = (id > 7 || id < 0 ? 7 : id);
    
            user.group = id;
    
            $.setIniDbNumber('group', username, id);
        }
    }

    /*
     * @function setUserGroupByName
     *
     * @param  {String} username
     * @param  {String} group
     */
    function setUserGroupByName(username, group) {
        setUserGroupById(username, getGroupIdByName(group));
    }

    /*
     * @function setUserGroupByName
     *
     * @param   {Number} id
     * @return  {Array}
     */
    function getUsernamesArrayByGroupId(id) {
        var keys = Object.keys(users),
            array = [];

        for (var i = 0; i < keys.length; i++) {
            if (users[keys[i]].group === id) {
                array.push(keys[i]);
            }
        }

        return array;
    }

    /*
     * @function loadGroups
     */
    function loadGroups() {
        var group;

        for (var i = 0; i < 8; i++) {
            group = getGroupNameById(i);

            $.getSetIniDbString('groups', i, group);
            $.getSetIniDbString('grouppoints', group, '-1');
            $.getSetIniDbString('grouppointsoffline', group, '-1');
        }
        setUserGroupById($.botName, 1);
        setUserGroupById($.ownerName, 1);
    }

    /*
     * @function cleanupUsers
     */
    function cleanupUsers() {
        var keys = Object.keys(users),
            i;

        for (i in keys) {
            if (!$.usernameCache.hasUser(keys[i])) {
                setUserGroupByIdIfExists(keys[i], 7);
                $.username.removeUser(keys[i]);
                delete users[keys[i]]; 
            }
        }
    }

    /*
     * @event ircChannelJoin
     */
    $.bind('ircChannelJoin', function(event) {
        var username = event.getUser().toLowerCase();

        if (!userExists(username)) {
            if (!$.user.isKnown(username)) {
                $.setIniDbBoolean('visited', username, true);
            }

            users[username] = new User(username, false, $.getIniDbNumber('group', username, 7));
            $.checkGameWispSub(username);
        }
    });

    /*
     * @event ircChannelMessage
     */
    $.bind('ircChannelMessage', function(event) {
        var username = event.getSender().toLowerCase(),
            user = getSetUser(username);

        if (!userExists(username)) {
            if (!$.user.isKnown(username)) {
                $.setIniDbBoolean('visited', username, true);
            }

            users[username] = new User(username, false, $.getIniDbNumber('group', username, 7));
            $.checkGameWispSub(username);
        }
    });

    /*
     * @event ircChannelLeave
     */
    $.bind('ircChannelLeave', function(event) {
        var username = event.getUser().toLowerCase();

        if (userExists(username)) {
            setUserGroupByIdIfExists(username, 7);
            $.username.removeUser(username);
            delete users[username];
        }
    });

    /*
     * @event ircChannelUserMode
     */
    $.bind('ircChannelUserMode', function(event) {
        var username = event.getUser().toLowerCase(),
            user = getSetUser(username);

        if (event.getMode().equalsIgnoreCase('o')) {
            if (event.getAdd() == true) {
                if (user.hasMode === false) {
                    if (isOwner(username)) {
                        setUserGroupById(username, 0);
                    } else if (isAdmin(username)) {
                        setUserGroupById(username, 1);
                    } else {
                        setUserGroupById(username, 2);
                    }
                    user.hasMode = true;
                }
            } else {
                if (user.hasMode === true) {
                    setUserGroupById(username, 7);

                    user.hasMode = false;
                }
            }
        }
    });

    /*
     * @event ircPrivateMessage
     */
    $.bind('ircPrivateMessage', function(event) {
        var username = event.getSender().toLowerCase(),
            message = event.getMessage().toLowerCase(),
            tags = event.getTags();

        if (username.equalsIgnoreCase('jtv')) {
            if (message.indexOf('moderators of') !== -1) {
                var split = message.substring(33).split(', '),
                    keys = $.inidb.GetKeyList('group', ''),
                    user,
                    i;

                // Remove old moderators and subscribers. The status for subscribers will be updated once they chat.
                for (i in keys) {
                    if ($.inidb.get('group', keys[i]).equals('2') || $.inidb.get('group', keys[i]).equals('3')) {
                        $.inidb.del('group', keys[i]);
                    }
                }

                // Set the new moderators.
                for (i in split) {
                    if (!isAdmin(split[i]) && !isBot(split[i])) {
                        $.inidb.set('group', keys[i], '2');
                    }
                }
            } else {
                if (message.indexOf('specialuser') !== -1) {
                    var userName = message.split(' ')[1],
                        userObj = getUser(userName);

                    if (tags.get('subscriber').equals('1')) {
                        if (userObj === undefined || userObj.group !== 3) {
                            setUserGroupByIdIfNotMod(userName, 3);
                        }
                    } else {
                        if (userObj !== undefined && userObj.group === 3 && !$.getIniDbBoolean('gamewispsubs', userName, false)) {
                            setUserGroupByIdIfNotMod(userName, 7);
                        }
                    }
                }
            } 
        }
    });

    /*
     * @event command
     */
    $.bind('command', function(event) {
        var sender = event.getSender(),
            command = event.getCommand(),
            args = event.getArgs(),
            action = args[0],
            subAction = args[1],
            actionArgs = args[2];

        /*
         * @commandpath mods - List moderators currently in the channel
         */
        if (command.equalsIgnoreCase('mods')) {
            var mods = getUsernamesArrayByGroupId(2);

            if (mods.length > 20) {
                $.say($.whisperPrefix(sender) + $.lang.get('permissions.current.listtoolong', mods.length));
            } else {
                $.say($.whisperPrefix(sender) + $.lang.get('permissions.current.mods', mods.join(', ')));
            }
        }

        if (command.equalsIgnoreCase('permission')) {
            if (action === undefined) {
                $.say($.whisperPrefix(sender) + 'Usage: !permission [set / get / list]');
                return;
            }

            /*
             * @commandpath permission set [username] [permission id] - Sets the permission for that user.
             */
            if (action.equalsIgnoreCase('set')) {
                if (subAction === undefined || isNaN(parseInt(actionArgs))) {
                    $.say($.whisperPrefix(sender) + 'Usage: !permission set [username] [permission id]');
                    return;
                }

                $.say($.whisperPrefix(sender) + 'Permission for ' + subAction + ' has been changed to ' + getGroupNameById(parseInt(actionArgs)));
                setUserGroupById(subAction.toLowerCase(), parseInt(actionArgs));
            }

            /*
             * @commandpath permission get [username] - Gets the permission for that user.
             */
            if (action.equalsIgnoreCase('get')) {
                if (subAction === undefined) {
                    $.say($.whisperPrefix(sender) + 'Usage: !permission get [username]');
                    return;
                }

                $.say($.whisperPrefix(sender) + 'Permission for ' + subAction + ' is currently set to ' + getUserGroupName(subAction));
            }

            /*
             * @commandpath permission list - Gets the permission list and the id.
             */
            if (action.equalsIgnoreCase('list')) {
                $.say($.whisperPrefix(sender) + 'Current permissions: (0 - Caster), (1 - Admin), (2 - Mod), (3 - Sub), (4 - Donator), (5 - Hoster), (6 - Regular), and (7 - Viewer)');
            }
        }

        if (command.equalsIgnoreCase('permissionpoints')) {
            if (action === undefined || subAction === undefined || isNaN(parseInt(action)) || $.outOfRange(parseInt(action), 0, 7)) {
                $.say($.whisperPrefix(sender) + 'Usage: !permissionpoints [permission id] [online / offline]');
                return;
            }

            /*
             * @commandpath permissionpoints [permissionID] online [points] - Set the points gained for each permissions while the stream is online. -1 defaults to the global configuration.
             */
            if (subAction.equalsIgnoreCase('online')) {
                if (actionArgs === undefined || isNaN(parseInt(actionArgs))) {
                    $.say($.whisperPrefix(sender) + 'Usage: !permissionpoints [permission id] online [amount] - Using -1 will reset to default settings.');
                    return;
                }
            }

            /*
             * @commandpath permissionpoints [permissionID] offline [points] - Set the points gained for each permissions while the stream is offline. -1 defaults to the global configuration.
             */
            if (subAction.equalsIgnoreCase('offline')) {
                if (actionArgs === undefined || isNaN(parseInt(actionArgs))) {
                    $.say($.whisperPrefix(sender) + 'Usage: !permissionpoints [permission id] offline [amount] - Using -1 will reset to default settings.');
                    return;
                }
            }
        }
    });

    /*
     * @event initReady
     */
    $.bind('initReady', function() {
        $.registerChatCommand('./core/permissions.js', 'mods', 1);
        $.registerChatCommand('./core/permissions.js', 'permission', 1);
        $.registerChatCommand('./core/permissions.js', 'permissionpoints', 1);

        setInterval(cleanupUsers, 3e5);
        loadGroups();
    });

    /* Export functions to the API. */
    $.getUser = getUser;
    $.getSetUser = getSetUser;
    $.userExists = userExists;
    $.isBot = isBot;
    $.isOwner = isOwner;
    $.isCaster = isCaster;
    $.isAdmin = isAdmin;
    $.isMod = isMod;
    $.isSub = isSub;
    $.isDonator = isDonator;
    $.isReg = isReg;
    $.getUserGroupId = getUserGroupId;
    $.getUserGroupName = getUserGroupName;
    $.getGroupNameById = getGroupNameById;
    $.getGroupIdByName = getGroupIdByName;
    $.getGroupPointMultiplier = getGroupPointMultiplier;
    $.setUserGroupById = setUserGroupById;
    $.setUserGroupByName = setUserGroupByName;
    $.setUserGroupByIdIfNotMod = setUserGroupByIdIfNotMod;
    $.setUserGroupByIdIfExists = setUserGroupByIdIfExists;
    $.getUsernamesArrayByGroupId = getUsernamesArrayByGroupId;
    $.loadGroups = loadGroups;
    $.getUsers = getUsers;
    $.users = users;
})();

