"use client"
import Script from "next/script"

export function ChatwootWidget() {
  return (
    <>
      <Script
        id="chatwoot-script"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(d,t) {
              var BASE_URL="https://mcm-chat-prod-chatwoot.juhbvp.easypanel.host";
              var g=d.createElement(t),s=d.getElementsByTagName(t)[0];
              g.src=BASE_URL+"/packs/js/sdk.js";
              g.async = true;
              s.parentNode.insertBefore(g,s);
              g.onload=function(){
                window.chatwootSDK.run({
                  websiteToken: 'RHGkmDJvkBMz4ALXDPZxChgR',
                  baseUrl: BASE_URL
                })
              }
            })(document,"script");
          `,
        }}
      />
    </>
  )
}

// Type declarations for Chatwoot
declare global {
  interface Window {
    chatwootSDK: {
      run: (config: { websiteToken: string; baseUrl: string }) => void
    }
    $chatwoot: {
      toggle: () => void
    }
  }
}
