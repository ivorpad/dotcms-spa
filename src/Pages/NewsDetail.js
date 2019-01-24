import React from 'react';
import NewsDetail from '../Components/News/NewsDetail';

class NewsDetailPage extends React.Component {
  constructor(props, context) {
    super(props, context);

    const newsMock = {
      baseType: 'CONTENT',
      byline: 'Jean Folger',
      caption:
        'Did you know there are better times to buy gas than others and ways to actually stretch that dollar a little further?',
      commentscount: 3,
      contentType: 'News',
      expire: '2020-01-01 20:19:00.0',
      folder: 'SYSTEM_FOLDER',
      hasTitleImage: true,
      host: '48190c8c-42c4-46af-8d1a-0cd5db894797',
      hostName: 'demo.dotcms.com',
      identifier: '2943b5eb-9105-4dcf-a1c7-87a9d4dc92a6',
      image: '/dA/2943b5eb-9105-4dcf-a1c7-87a9d4dc92a6/image/gas-pump.jpg',
      imageContentAsset: '2943b5eb-9105-4dcf-a1c7-87a9d4dc92a6/image',
      imageVersion:
        '/dA/aaee9776-8fb7-4501-8048-844912a20405/image/gas-pump.jpg',
      inode: 'aaee9776-8fb7-4501-8048-844912a20405',
      languageId: 1,
      latlong: '29.7604267,-95.3698028',
      lead:
        'Historically, the price of gasoline has been tied to changes in the cost of crude oil; as crude prices rise, consumers can expect to pay more at the pump, and the reverse is also true.',
      modDate: '2017-05-08 13:01:47.357',
      modUser: 'dotcms.org.1',
      modUserName: 'Admin User',
      owner: 'dotcms.org.1',
      sortOrder: 0,
      stInode: '28039964-5615-4ccf-bb96-ded62adbcc6a',
      story:
        "<p>Houston, Tx.&nbsp;Crude oil and, by default, gasoline prices, are driven by a complex assortment of factors that affect supply and demand, including geopolitical risks, weather, inventories, global economic growth, exchange rates, speculation, hedging and investment activity. From the risk of piracy in the Straits of Malacca and Hormuz, to transit vulnerability in the Caspian and extreme weather in the United States, crude is constantly susceptible to a variety of price-driving forces.<br /><br />The worldwide demand for crude oil, gasoline and petroleum products that are made from crude is expected to increase as the U.S. and global economies strive to recover. This growing demand, coupled with political instability in the Middle East and North Africa (MENA) region and the decline in the U.S. dollar's value, are what pushed gasoline prices to $4 per gallon earlier this year. While gas prices climbed, the average cost for crude oil rose from about $90 per barrel in mid-February, 2011, to about $127 per barrel two months later.</p>↵<p>Figure 1 shows average regular gasoline prices in the U.S. over the past three years. Crude oil and gasoline reached record highs during 2008, following surges in worldwide demand due in part to increased demand from emerging markets like China and India. During the second half of 2008, demand and prices both tumbled in response to deteriorating economic conditions. From June to December of 2008, gasoline prices fell from just over $4 per gallon to $1.59. Prices rose steadily through the middle of 2009, bounced up and down for the next year, and then by September 2010, gas prices took off with unrelenting daily price increases. Fears of $6 gas, a slowing economy and decreased demand put the brakes on the uptrend, and price increases finally slowed by mid-May, 2011.</p>↵<p><br /><strong>Where Do Our Dollars Go At The Pump?</strong><br />According to the EIA data from 2010, 68% of every dollar at the gas pump goes to crude oil - the raw material used to produce gasoline. Refining the crude oil into gasoline and retailing, which includes distribution and marketing, adds 18% to the price that consumers pay for gasoline. The remaining 14% of every dollar goes towards excise taxes.<br /><br />In the United States, the federal government excise tax is currently 18.4 cents per gallon. The average fuel tax paid by consumers, however, is 49.5 cents per gallon. The difference comes from state and local government taxes, which vary widely across the U.S. The tax in Alaska, for example, is about 26 cents per gallon; in Connecticut, the rate is more than 70 cents per gallon.<br /><br />Perhaps surprisingly, the United States produces 51% of the oil and petroleum products that it consumes. The rest is imported from other countries, including Canada at the top of the list (25%); Saudi Arabia (12%); Venezuela (10%) and Mexico (9%).<br /><br /><strong>What's Ahead?</strong><br />The Energy Information Administration (EIA) expects that the annual price of WTI (West Texas Intermediate) crude will average $103 per barrel in 2011 and $107 per barrel in 2012; the 2010 average was $79. The EIA projects rising crude costs will add an average of 85 cents more per gallon of gasoline during 2011, with an additional three cents per gallon during 2012. The 2010 average regular pump price was $2.78 per gallon; EIA's forecast for 2011 and 2012 is $3.63 and $3.66, respectively.<br /><br />Despite these carefully crafted forecasts, any one of a vast number of factors could trigger strong changes in crude and gasoline prices - both to the upside and downside.<br /><br /><strong>Up and Down (and Up and Down)</strong><br />The weak U.S. dollar only exaggerates rising global oil prices for American consumers. Countries with strong currencies, including those using the euro and the yen, are generally exposed to smaller price increases. Though high gas prices are never welcome, they have come at a particularly tricky time as unemployment and foreclosure rates remain high and food prices soar. While gas prices in the U.S. are still a dollar higher than this time last year, they continue to drop from the early May highs.</p>",
      sysPublishDate: '2011-06-29 11:00:00.0',
      tags: 'retiree:persona,prices,gas,investment,oil',
      title: 'The Gas Price Rollercoaster',
      titleImage: 'image',
      topic: 'Investment Banking',
      url: '/2943b5eb-9105-4dcf-a1c7-87a9d4dc92a6.content',
      urlTitle: 'the-gas-price-rollercoaster'
    };

    this.state = {
      news: newsMock
    };
  }

  stripHtmlTags(rawText) {
    const div = document.createElement('div');
    div.innerHTML = rawText;
    return div.textContent || div.innerText || '';
  }

  async componentDidMount() {
    const storyText = this.stripHtmlTags(this.state.news.story);

    this.setState(state => ({
      ...state,
      news: { ...state.news, story: storyText }
    }));
  }

  render() {
    return (
      <>
        <NewsDetail news={this.state.news} />
      </>
    );
  }
}

export default NewsDetailPage;
