var TSRoomLayer = cc.Layer.extend({

    menu:null,

    init:function () {
        var bRet = false;
        if (this._super()) {

            G_SceneState = G_SceneType.TSRoomLayer;

            var sp = cc.Sprite.create(s_loading);
            sp.setAnchorPoint(cc.p(0,0));
            this.addChild(sp, 0, 1);

            cc.MenuItemFont.setFontName("Arial");
            cc.MenuItemFont.setFontSize(26);
            var label = cc.LabelTTF.create("Back MainMenu", "Arial", 20);
            var back = cc.MenuItemLabel.create(label, this.onBackCallback);
            back.setScale(0.8);

            this.menu = cc.Menu.create(back);
            this.menu.alignItemsVerticallyWithPadding(10);
            this.addChild(this.menu);

            var cp_back = back.getPosition();
            cp_back.y -= 200.0;
            back.setPosition(cp_back);

            bRet = true;

            var sPacket = {
                MM:"SysOrder",
                Order:"GetRoomList"
            };
            SendBuffer(G_hSocket, sPacket);
        }

        return bRet;
    },
    onBackCallback:function (pSender) {
        var scene = cc.Scene.create();
        scene.addChild(TSMainMenu.create());
        cc.Director.getInstance().replaceScene(cc.TransitionFade.create(1.2, scene));
    },

    onRoomCallback:function(pSender) {
        var label = pSender.getLabel();
        var RoomID = label.RoomID;
    },

    onMessageProc:function (oPacket) {
        switch(oPacket.MM){
            case "GetRoomList":
                cc.MenuItemFont.setFontName("Arial");
                cc.MenuItemFont.setFontSize(26);

                var index = 0;
                for (var i in oPacket.Data){
                    var iter = oPacket.Data[i];
                    var label = cc.LabelTTF.create("Room:" + iter.LeaderName + " RoomID:" + iter.RoomID, "Arial", 20);
                    label.RoomID = iter.RoomID;
                    var room = cc.MenuItemLabel.create(label, this.onRoomCallback);
                    room.setScale(0.8);

                    var PosRoom = room.getPosition();
                    PosRoom.y = 200 - 25 * index++;
                    room.setPosition(PosRoom);

                    this.menu.addChild(room);
                }

                break;
        }
    }
});

var G_TSRoomLayer = null;

TSRoomLayer.create = function () {
    var sg = new TSRoomLayer();
    if (sg && sg.init()) {
        G_TSRoomLayer = sg;
        return sg;
    }
    return null;
};

TSRoomLayer.MessageProc = function (oPacket) {
    if (G_TSRoomLayer == null)
        return;
    G_TSRoomLayer.onMessageProc(oPacket);
};