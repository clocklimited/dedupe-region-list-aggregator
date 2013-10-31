var now = new Date()
  , isoCreated = now.toISOString()
  , isoLive = new Date(now.getFullYear() - 1, 1, 1).toISOString()
  , isoExpired = new Date(now.getFullYear() + 2, 1, 1).toISOString()
  , isoPublished = new Date(now.getFullYear() - 1, 1, 1).toISOString()

module.exports =
  { validNewPublishedModel:
    { enableLike: true
    , likeCount: 0
    , enableComments: true
    , commentCount: 0
    , viewCount: 0
    , tags: []
    , showDisplayDate: true
    , displayDate: isoPublished
    , dateCreated: isoCreated
    , expiryDate: isoExpired
    , liveDate: isoLive
    , social: []
    , socialTwitter: 'Some twitter share promo text'
    , socialFacebook: 'Some facebook share promo text'
    , pageDescription: 'PageDescription'
    , pageTitle: 'PageTitle'
    , seoKeywords: 'SeoKeywords'
    , images: {}
    , downloads: []
    , body: []
    , standfirst: 'standFirst'
    , slug: 'Slug'
    , subTitle: 'subTitle'
    , shortTitle: 'ShortTitle'
    , longTitle: 'LongTitle'
    , preTitleHtml: '<p>PreTitleHtml</p>'
    , section: '1'
    , state: 'Published'
    , author: 'Author'
    , secondaryType: ''
    }
  , validNewModel:
    { state: 'Draft'
    , longTitle: 'Headline is required'
    , dateCreated: isoCreated
    }
  }
