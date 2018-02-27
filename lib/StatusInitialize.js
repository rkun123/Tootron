
module.exports = function(status){
    var _resultStatus = {};
    //console.log("status:"+status);
    _resultStatus.id = status.id;
    _resultStatus.content = contentModifier(String(status.content));
    _resultStatus.display_name = status.account.display_name;
    _resultStatus.media_attachments = status.media_attachments;
    _resultStatus.favIcon = favoriteChecker(String(status.favourited));
    return _resultStatus;
}

function contentModifier(content){
    var _temp = content;
    _temp = _temp.replace(/<\/?p>/,"");//remove p-tag.
    return _temp; 
}

function favoriteChecker(favNum){
    if(favNum){
        return "favorited";
    }else{
        return "favorite_border"
    }
}

function timestampModifier(created_at){
    var _temp = "";
    created_at.replace(/T[\w:.]*/,"");
}