import { Jetstream } from '@skyware/jetstream';
import {createUserClient} from '../lib/x/client.ts';
import { postService } from '../services/posts/index.ts';
import logger from '../utils/logger.ts';
import { userService } from '../services/users/index.ts';
import { queueService } from '../services/queue/index.ts';

const jetstream = new Jetstream(
  {
    wantedCollections: ["app.bsky.feed.post"],
    wantedDids: ["did:plc:sn4pfzhfmg4ahxfnuozvwzk2", "did:plc:yzq6zy5svz24drbpxue6em2n"], 
  }
)

export async function startListeners() {
  try {
    logger.info("Starting listeners");
    jetstream.onCreate("app.bsky.feed.post", async (event) => {
      console.log(`New post: ${JSON.stringify(event.commit.record, null, 2)}`)
      if (event.commit.record.reply?.root) {
        return logger.info("Reply post, dropping event", { root: event.commit.record.reply.root });
      }
      const userDid = event.did.split(":")[2];
      const userResult = await userService.getUserByBskyDid(userDid);
      if (userResult.isErr) {
        return logger.error("Error fetching user", { error: userResult.error });
      }
      if (!userResult.value) {
        return logger.warn("User not found", { userDid });
      }
      const user = userResult.value;
      const postResult = await postService.createPost({
        content: event.commit.record.text,
        bskyPostId: event.commit.cid,
        source: 'bluesky',
        userId: user.id,
      });
      if (postResult.isErr) {
        return logger.error('Error creating post', { error: postResult.error });
      }
      const post = postResult.value;
      logger.info('Post created:', { postId: post.id, bskyId: post.bskyPostId });
      logger.info('adding post to queue', { postId: post.id });
      queueService.addToQueue('crosspost', {
        content: event.commit.record.text,
        userId: user.id,
        postId: post.id,
        source: 'bluesky',
      })
        // const xResult = await xUserClient.v2.tweet(event.commit.record.text, {text: event.commit.record.text})
        
        // const updateResult = await prisma.post.update({
        //   where: {
        //     id: post.id
        //   },
        //   data: {
        //     xPostId: xResult.data.id,
        //     crossPostedTo: 'x',
        //   },
        // });
        // logger.info('crossposting to X completed', {xPostId: updateResult.xPostId});
  });
  
  jetstream.onDelete("app.bsky.feed.post", (event) => {
      console.log(`Deleted post: ${event.commit.rkey}`)
  });
    
  jetstream.on("account", (event) => {
    console.log(`Account updated: ${event.did}`)
  });

    const url = jetstream.url;
    console.log(`Jetstream URL: ${url}`);
    jetstream.start();
    
   // cannot stream twitter without paying a lot of money $$$$

    
    // Bluesky listener (polling every minute)
    // I think we can do this with webhooks
    // setInterval(async () => {
      //   const users = await prisma.user.findMany({
        //     where: { accounts: { some: { provider: 'bluesky' } } },
        //     include: { accounts: { where: { provider: 'bluesky' } } },
        //   })
        
        //   for (const user of users) {
          //     const blueskyAccount = user.accounts[0]
          //     await bskyAgent.login({
            //       identifier: blueskyAccount.providerAccountId,
            //       password: blueskyAccount.bskyToken!, // Note: In a real-world scenario, you'd use a more secure method to store and retrieve tokens
            //     })
            
            //     const { data } = await bskyAgent.getAuthorFeed({
              //       actor: blueskyAccount.providerAccountId,
              //       limit: 1,
              //     })
              
              //     if (data.feed.length > 0) {
                //       const latestPost = data.feed[0].post
                //       const existingPost = await prisma.post.findFirst({
                  //         where: { originalId: latestPost.uri, source: 'bluesky' },
                  //       })
                  
                  //       if (!existingPost) {
                    //         await queueService.addToQueue('crosspost', {
                      //           userId: user.id,
                      //           content: latestPost.record.text,
                      //           source: 'bluesky',
                      //           originalId: latestPost.uri,
                      //         })
                      //       }
                      //     }
                      //   }
    // }, 60000) // Check every minute
  } catch (error) {
    logger.error('Error:', { error: error as Error });
  }
 }