@using Wisky.Data.Utility
@model Portal.Web.Models.PortalDataModel

<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
    <meta charset="utf-8">
    <link rel="stylesheet" type="text/css" href="/Content/css/bootstrap-lumen.min.css">
    <link rel="stylesheet" type="text/css" href="/Content/css/font-awesome.min.css">
    <link rel="stylesheet" type="text/css" href="/Content/css/style.css">
    <title>@Model.PageTitle</title>
    <style>
            .body-wrapper:before { background: url('@ViewBag.Advertising.BackgroundUrl') 50% 50%/cover no-repeat fixed transparent; }
    </style>

</head>
<body>
    @if (!Model.IsAdvertisingRequired)
    {
        <!-- Form might no be placed in <head> but.. Finding another solution-->
        <form id="redirect" method="POST">
            <input type="hidden" name="username" value="@Model.UserMac" />
            <input type="hidden" name="dst" value="@Model.SuccessPageUrl" />
            <input type="hidden" name="LoginUrl" value="@Model.LoginUrl" />
        </form>
        <script>
            var loginURl = $('input[name="LoginUrl"]').val();
            //  alert(loginURl);
            jQuery.ajax({
                url: loginURl,
                method: 'POST',
                data: $('#redirect').serialize()
            }).done(function (response) {}).fail(function () {});
        </script>
    }
    <!--Advertising Content-->
    @if (ViewBag.Advertising.AdType == (int)AdFormatEnum.Video)
    {
        <div style="height: 100%; position: fixed; width: 100%;">
            <iframe frameborder="0" height="100%" width="100%"
                    src="@ViewBag.Advertising.AdDestinationUrl?autoplay=1&controls=1&showinfo=0&autohide=1"
                    allowfullscreen></iframe>
        </div>
        <style>
            body {
                padding: 0;
            }

            #redirect {
                margin: 0;
            }
        </style>
    }
    else
    {
        <div class="body-wrapper">

        </div>
    }

    <!--End Advertising Content-->
    <nav class="navbar navbar-default navbar-fixed-top nt-navbar">
        <div class="container">
            <!-- Brand and toggle get grouped for better mobile display -->
            <div class="msg-container">
                <label id="msgClock">Please wait in...<span id="inputClock"></span> </label>
                <label id="msgSuccess">Connection is ready.</label>
            </div>
        </div>
    </nav>
    <footer>
        <form action="~/Portal/Step2" method="post">
            <input type="hidden" name="LoginId" value="@Model.LoginId" />
            <input type="hidden" name="AdId" value="@ViewBag.Advertising.AdId" />
            <input type="hidden" name="IsReactAd" value="true" />
            <input type="hidden" name="DestinationUrl" value="@ViewBag.Advertising.ContentUrl" />
            <div class="control-container">
                <h2 class="title">@ViewBag.Advertising.AdText</h2>
                @if (ViewBag.Advertising.AdType == (int)AdFormatEnum.ClickWebsite)
                {
                    <div class="form-group">
                        <button type="button" onclick="shareLink('@ViewBag.Advertising.ContentUrl')" class="btn btn-success btn-lg">
                            Share
                        </button>
                    </div>
                }
                else if (ViewBag.Advertising.AdType == (int)AdFormatEnum.GetOffer)
                {
                    <div class="form-group">
                        <button type="submit" class="btn btn-success btn-lg">
                            View Promotion
                        </button>
                    </div>
                }
                else if (ViewBag.Advertising.AdType == (int)AdFormatEnum.LikeFacebook)
                {
                    var placeId = Model.LocationId;

                    if (ViewBag.Advertising.IsEnableCheckin.Value && placeId != 0)
                    {
                        <input type="hidden" id="placeId" value="@placeId" />
                        <div class="form-group" id="checkinContainer" style="display: none">
                            <label class="label"></label>
                            <input type="text" class="form-control" id="checkInMessage" value=""
                                   style="width:70%; margin: 0 auto; margin-bottom: 20px" placeholder="@ViewBag.Advertising.CheckinMessage" />
                            <button type="submit" onclick="checkIn()" class="btn btn-success btn-lg">
                                Check in now!
                            </button>
                        </div>
                        <div id="likePageContainer" style="display: none">
                            <script src="~/Content/js/like-facebook.js"></script>
                            <div class="form-group">
                                <div id="fb-root"></div>
                                <div class="fb-page" data-href="@ViewBag.Advertising.ContentUrl"
                                     data-width="260" data-hide-cover="false" data-show-facepile="true"></div>
                            </div>
                        </div>
                    }
                    else
                    {
                        <script src="~/Content/js/like-facebook.js"></script>
                        <div class="form-group">
                            <div id="fb-root"></div>
                            <div class="fb-page" data-href="@ViewBag.Advertising.ContentUrl"
                                 data-width="260" data-hide-cover="false" data-show-facepile="true"></div>
                        </div>
                    }

                }
                else if (ViewBag.Advertising.AdType == (int)AdFormatEnum.DoSurvey)
                {
                    <!-- NOT implemented yet-->
                }
                else if (ViewBag.Advertising.AdType == (int)AdFormatEnum.AppInstall)
                {
                    <div class="form-group">
                        <button type="submit" class="btn btn-success btn-lg">
                            Download App
                        </button>
                    </div>
                }


            </div>
        </form>
        <form action="~/Portal/Step2" method="post">
            <input type="hidden" name="LoginId" value="@Model.LoginId" />
            <input type="hidden" name="AdId" value="@ViewBag.Advertising.AdId" />
            <input type="hidden" name="IsReactAd" value="false" />
            <input type="hidden" name="DestinationUrl" value="@Model.SuccessPageUrl" />
            <div class="control-container">
                <div class="form-group">
                    <button type="submit" class="btn btn-primary btn-lg" data-type="hidden">
                        @(ViewBag.Advertising.SuccessButtonText ?? "Connect to the Internet")
                    </button>
                </div>
            </div>
        </form>
    </footer>

    <!-- add facebook/google info -->
    <input type="hidden" name="LoginMode" value="@Model.LoginMode" />
    <input type="hidden" id="FacebookId" value="" />
    <input type="hidden" id="LoginId" value="@Model.LoginId" />

    <script src="~/Content/js/jquery-1.9.1.js"></script>
    @if (Model.LoginMode == (int)LoginModeEnum.Facebook)
    {
        <input type="hidden" id="facebookID" value="@ViewBag.FacebookID" />
        @:
        <script src="~/Content/js/step2/sdk.js"></script>
        @:
        <script src="~/Content/js/step2/facebook.js"></script>
    }
    else if (Model.LoginMode == (int)LoginModeEnum.GooglePlus)
    {
        <input type="hidden" id="googleID" value="@ViewBag.GoogleID" />
        @:
        <script src="~/Content/js/step2/client-platform.js" async defer></script>
        @:
        <script src="~/Content/js/step2/google.js"></script>
        <div id="gConnect" class="button" hidden="hidden">
            <button class="g-signin"
                    data-scope="email"
                    data-clientid="@ViewBag.GoogleID"
                    data-callback="onSignInCallback"
                    data-theme="dark"
                    data-cookiepolicy="single_host_origin"></button>

        </div>
    }
    else
    {
        <script>
            $(document).ready(function(){
                try {
                    $('#likePageContainer').css("display", "block");
                } catch (e) {
                    console.log(e.message);
                }
            })
        </script>
    }

    <script>
        function getValue(selector) {
            return $(selector);
        }
    </script>


    <!-- NEW CODE - DucBM -->
    <div class="top-bar">

        <!-- Counter -->
        <div class="ready-counter" data-timeout="5">
            Internet Wi-Fi Miễn Phí <span class="timeout"></span>s...
        </div>

    </div>
    <div class="wrapper bg dark-after" data-ibg-bg="images/vegas.jpg">

        <div class="main move-up portal-2">
            <div class="center-align-wrapper">
                <div class="center-align-box header">

                    <div class="content">
                        <h3 class="text">Try the new model today! Enjoy our test drive.</h3>
                        <button class="btn btn-orange">Kết nối và truy cập</button>
                        <button class="btn btn-connect">Kết nối</button>
                    </div>

                </div>
            </div>
        </div>

    </div><!-- /wrapper bg -->



    <!-- Load scripts -->
    <script type="text/javascript" src="/Content/js/jquery-1.9.1.js"> </script>
    <script type="text/javascript" src="/Content/js/bootstrap.min.js"> </script>
    <script> window['duration'] = @ViewBag.Advertising.Duration; </script>
    <script type="text/javascript" src="/Content/js/quiz-clock.js"> </script>
    <script type="text/javascript" src="~/Content/js/jquery.interactive_bg_DnP.js"> </script>
    <script type="text/javascript" src="/Content/js/script.js"> </script>
    <script type="text/javascript" src="/Content/js/submit-ad.js"> </script>
</body>
</html>