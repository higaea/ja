### useful api
1. get user's pages
curl -i -X GET \
 "https://graph.facebook.com/v3.2/me/accounts?access_token=EAAg3U9spCgEBABYZCZB5Si5CG6oGJfT6rRgnoufJs0IpksaWyktx8EY4Ak0wraLwEYGugfeW278jVgJJq6Tac5SSaO66maZBtUkkN5J5V62AZAxpGCiJmNmd3OUDwK0YRlO3Y1lcYgXjlD02by3TEZCPZBNtkzOs12u6yjPeZAwk9Cgy5BT4npy0vxerg6klX6fHaODZBeEThgZDZD"

 2. get page's IG business account
 curl -i -X GET \
 "https://graph.facebook.com/v3.2/2599907546710666?fields=instagram_business_account&access_token=EAAg3U9spCgEBAKuFlT2N2hV8KrwpPh66MM7zUwjLMBt6V62bXLti14X7wqJZBizZAHXUHfv9vA5lKbC7LLQDu2F79ICscNhirR11D19R8kTmoJYDQ9hVsvXb3IRPA1LxKDZB3zrtQcAcZCbFzo8AqY1FVc6Cu28O8wdBtbqzhlRhBwsZBRUmMndUJVnI06tgEaOicM62TiAZDZD"
    
3. get IG business account's Media Objects
curl -i -X GET \
 "https://graph.facebook.com/v3.2/17841416379689860/media?access_token=EAAg3U9spCgEBAE05mcano8EpEVkZBOBZClHoXwC4YayWqNcZAlqA02joUD6SvINRzCmoGU3KRDhIt94coR20ZCLZB6HuIjLRlE7LcCyNfKnH3068CMN1ov68L9qgmGgtfzohyPkcg3CvAmSVHUwc6WpFfEdYs9gM2Y65l7IgEWUZC3KemmcmZAucOBayPEQZAdL8gevG6ZCao0gZDZD"

4. get hashtag's node ID
curl -X GET \
 "https://graph.facebook.com/v3.2/ig_hashtag_search?user_id=17841416379689860&q=bluebottle&access_token=EAAg3U9spCgEBAE05mcano8EpEVkZBOBZClHoXwC4YayWqNcZAlqA02joUD6SvINRzCmoGU3KRDhIt94coR20ZCLZB6HuIjLRlE7LcCyNfKnH3068CMN1ov68L9qgmGgtfzohyPkcg3CvAmSVHUwc6WpFfEdYs9gM2Y65l7IgEWUZC3KemmcmZAucOBayPEQZAdL8gevG6ZCao0gZDZD"

5. get data about a hashtag
curl -X GET \
 "https://graph.facebook.com/v3.2/17843857450040591?user_id=17841416379689860&q=bluebottle&access_token=EAAg3U9spCgEBAE05mcano8EpEVkZBOBZClHoXwC4YayWqNcZAlqA02joUD6SvINRzCmoGU3KRDhIt94coR20ZCLZB6HuIjLRlE7LcCyNfKnH3068CMN1ov68L9qgmGgtfzohyPkcg3CvAmSVHUwc6WpFfEdYs9gM2Y65l7IgEWUZC3KemmcmZAucOBayPEQZAdL8gevG6ZCao0gZDZD"

6. to get the most recently published photos and videos that have a specific hashtag
curl -X GET \
 "https://graph.facebook.com/v3.2/17843857450040591/recent_media?user_id=17841416379689860&q=bluebottle&access_token=EAAg3U9spCgEBAE05mcano8EpEVkZBOBZClHoXwC4YayWqNcZAlqA02joUD6SvINRzCmoGU3KRDhIt94coR20ZCLZB6HuIjLRlE7LcCyNfKnH3068CMN1ov68L9qgmGgtfzohyPkcg3CvAmSVHUwc6WpFfEdYs9gM2Y65l7IgEWUZC3KemmcmZAucOBayPEQZAdL8gevG6ZCao0gZDZD"

7. to get the most popular photos and videos that have a specific hashtag
curl -X GET \
 "https://graph.facebook.com/v3.2/17843857450040591/top_media?user_id=17841416379689860&q=bluebottle&access_token=EAAg3U9spCgEBAE05mcano8EpEVkZBOBZClHoXwC4YayWqNcZAlqA02joUD6SvINRzCmoGU3KRDhIt94coR20ZCLZB6HuIjLRlE7LcCyNfKnH3068CMN1ov68L9qgmGgtfzohyPkcg3CvAmSVHUwc6WpFfEdYs9gM2Y65l7IgEWUZC3KemmcmZAucOBayPEQZAdL8gevG6ZCao0gZDZD"

 8. create an image on IG, but this API can only be used by IG partner
 curl -X POST \
 "https://graph.facebook.com/v3.2/17841416379689860/media?image_url=https//www.example.com/images/bronzed-fonzes.jpg"

 9. get an image's details 
 curl -X GET \
 "https://graph.facebook.com/v3.2/17852529088485685?fields=id,media_type,media_url,owner,timestamp&access_token=EAAg3U9spCgEBAE05mcano8EpEVkZBOBZClHoXwC4YayWqNcZAlqA02joUD6SvINRzCmoGU3KRDhIt94coR20ZCLZB6HuIjLRlE7LcCyNfKnH3068CMN1ov68L9qgmGgtfzohyPkcg3CvAmSVHUwc6WpFfEdYs9gM2Y65l7IgEWUZC3KemmcmZAucOBayPEQZAdL8gevG6ZCao0gZDZD"

10. post a comment on an image
 curl -X POST \
 "https://graph.facebook.com/v3.2/17862847066461005/comments?message=Hi%20IGIG%20@DerekDu666&access_token=EAAg3U9spCgEBANe9JS9b0uMaRILzf1jReHhJgNgo5ot8xbvWLfoKSA083vs2wDVgsl379Yt2xgIVaMEjK6XMyEELjY8QXeuxZBaeloNdZCgDI6ZCBnBqUdPZACbMLr7FYRlbMUgjTFG0SCNXYyFqwijcsn1BYa93UEyh8gEpjAZDZD"

11. get comments on an image
curl -X GET \
 "https://graph.facebook.com/v3.2/17991148285255392/comments?access_token=EAAg3U9spCgEBAI5C5iAZAin8uRSbA7YVojoho7Jdoz77YXiOabX77yVsp2RV4hycejBZBZCWb8AiYZA4xObvKvikDgxgIZBga34hANUG8FHupkRqog0yLKSZAPCAfNsJvRpX4LdpAhtyrLp6afTodhfklvmaR9MSLIc8pHGkcanSbSOI7vhdKaLQE1QFzqyquIpsyOtIw9AwZDZD"

12. get insights of an image
curl -X GET \
 "https://graph.facebook.com/v3.2/17991148285255392/insights?metric=impressions,reach&access_token=EAAg3U9spCgEBAI5C5iAZAin8uRSbA7YVojoho7Jdoz77YXiOabX77yVsp2RV4hycejBZBZCWb8AiYZA4xObvKvikDgxgIZBga34hANUG8FHupkRqog0yLKSZAPCAfNsJvRpX4LdpAhtyrLp6afTodhfklvmaR9MSLIc8pHGkcanSbSOI7vhdKaLQE1QFzqyquIpsyOtIw9AwZDZD"


curl -i -X GET \
 "https://graph.facebook.com/v3.2/17841416379689860?fields=mentioned_media.media_id(17864227378448845)&access_token=EAAg3U9spCgEBAI5C5iAZAin8uRSbA7YVojoho7Jdoz77YXiOabX77yVsp2RV4hycejBZBZCWb8AiYZA4xObvKvikDgxgIZBga34hANUG8FHupkRqog0yLKSZAPCAfNsJvRpX4LdpAhtyrLp6afTodhfklvmaR9MSLIc8pHGkcanSbSOI7vhdKaLQE1QFzqyquIpsyOtIw9AwZDZD"

### API Vi
1. client id: fa1dbde785744f5aab8a4d2b16bf2102
