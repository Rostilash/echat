import React from "react";
import style from "./Home.module.css";

export const Home = () => {
  return (
    <div className={style.main_page}>
      {/* Your massage */}
      <div className={style.home}>
        <div className={style.top_cart}>
          <div>
            <h3>Головна сторінка</h3>
          </div>
          <div>
            <span className={style.icon_image}>
              <img src="https://cdn-icons-png.flaticon.com/128/899/899531.png" alt="icon" />
            </span>
          </div>
        </div>

        <div className={style.bottom_cart}>
          <div className={style.user_image}>
            <img
              src="https://yt3.ggpht.com/Le0J3JGewM6Jhbua8gMIcV3wjuXbuDjtRXVjsWdi38bjW1c5g9YxqU8bVlrjrpOZCATpLQcCow=s88-c-k-c0x00ffffff-no-rj"
              alt="icon"
            />
          </div>
          <div className={style.user_info}>
            <div className={style.home_text}>
              <input type="text" placeholder="Що відбувається ?" />
            </div>

            <div className={style.home_actions}>
              <div className={style.icons}>
                <span className={style.icon_image}>
                  <img src="https://cdn-icons-png.flaticon.com/128/13123/13123917.png" alt="icon" />
                </span>
                <span className={style.icon_image}>
                  <img src="https://cdn-icons-png.flaticon.com/128/11633/11633511.png" alt="icon" />
                </span>
                <span className={style.icon_image}>
                  <img src="https://cdn-icons-png.flaticon.com/128/11846/11846979.png" alt="icon" />
                </span>
                <span className={style.icon_image}>
                  <img src="https://cdn-icons-png.flaticon.com/128/1182/1182408.png" alt="icon" />
                </span>
              </div>
              <div className={style.send_news}>
                <button>Надіслати</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* People messages  */}
      <div className={style.messages}>
        <div className={style.bottom_cart}>
          <div className={style.user_image}>
            <img
              src="https://yt3.ggpht.com/wEvA-cYzqYPx6Tg7P8-9AMUALcm_33aQ5gdy5BPfnpVofctZhFq6pgj1-IlH6R6rtoNDP-puJwo=s68-c-k-c0x00ffffff-no-rj"
              alt="icon"
            />
          </div>
          <div className={style.user_info}>
            <div className={style.messages_text}>
              <div className={style.user_name}>
                <p>Lofi Everyday</p>
                <span>@Lofi_vofi</span>
                <div class={style.dot_wrapper}>
                  <span className={style.dot}>.</span>
                </div>
                <span>3m</span>
              </div>
              <div>
                <img src="https://cdn-icons-png.flaticon.com/128/18557/18557107.png" alt="icon" style={{ height: "18px", width: "18px" }} />
              </div>
            </div>
            <div>useEffect - це хук React, який дозволяє синхронізувати компонент із зовнішньою системою .</div>

            <div className={style.message_actions}>
              <div className={style.message_icons}>
                <span className={style.icon_image}>
                  <img src="https://cdn-icons-png.flaticon.com/128/16689/16689811.png" alt="icon" /> <span>1</span>
                </span>
                <span className={style.icon_image}>
                  <img src="https://cdn-icons-png.flaticon.com/128/13951/13951393.png" alt="icon" /> <span></span>
                </span>
                <span className={style.icon_image}>
                  <img src="https://cdn-icons-png.flaticon.com/128/17217/17217096.png" alt="icon" /> <span>1</span>
                </span>
                <span className={style.icon_image}>
                  <img src="https://cdn-icons-png.flaticon.com/128/18166/18166719.png" alt="icon" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={style.messages}>
        <div className={style.bottom_cart}>
          <div className={style.user_image}>
            <img
              src="https://yt3.ggpht.com/cBjl6YDbv6639q6ELLETZhW3nOqAUhWIr9cx4fHUKjrmhs2YcfiHQ9KkNgGHU_psIfdw_aSt=s88-c-k-c0x00ffffff-no-rj"
              alt="icon"
            />
          </div>
          <div className={style.user_info}>
            <div className={style.messages_text}>
              <div className={style.user_name}>
                <p>
                  Avity <img src="https://cdn-icons-png.flaticon.com/128/7887/7887079.png" alt="icon" style={{ height: "12px", width: "12px" }} />
                </p>
                <span>@sktch_ComedyFan</span>
                <div class={style.dot_wrapper}>
                  <span className={style.dot}>.</span>
                </div>
                <span>15m</span>
              </div>
              <div>
                <img src="https://cdn-icons-png.flaticon.com/128/18557/18557107.png" alt="icon" style={{ height: "18px", width: "18px" }} />
              </div>
            </div>
            <div className={style.message_content}>
              <p>Я роблю один і той же знімок двічі. Спочатку серцем, потім камерою</p>
              <img src="https://images.unsplash.com/photo-1745450432714-f403f3fac945?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw1fHx8ZW58MHx8fHx8" />
            </div>

            <div className={style.message_actions}>
              <div className={style.message_icons}>
                <span className={style.icon_image}>
                  <img src="https://cdn-icons-png.flaticon.com/128/16689/16689811.png" alt="icon" /> <span>23</span>
                </span>
                <span className={style.icon_image}>
                  <img src="https://cdn-icons-png.flaticon.com/128/13951/13951393.png" alt="icon" /> <span>5</span>
                </span>
                <span className={style.icon_image}>
                  <img src="https://cdn-icons-png.flaticon.com/128/17217/17217096.png" alt="icon" /> <span>142</span>
                </span>
                <span className={style.icon_image}>
                  <img src="https://cdn-icons-png.flaticon.com/128/18166/18166719.png" alt="icon" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={style.messages}>
        <div className={style.bottom_cart}>
          <div className={style.user_image}>
            <img
              src="https://yt3.ggpht.com/SmANtx6ituy1f16EKHUruhfal5oXhW8FhWVBb9oxvqAZ1oVDYnWlF8GfiiIyS2JC7G9bYlYqiA=s68-c-k-c0x00ffffff-no-rj"
              alt="icon"
            />
          </div>
          <div className={style.user_info}>
            <div className={style.messages_text}>
              <div className={style.user_name}>
                <p>
                  Aloha Vibes{" "}
                  <img src="https://cdn-icons-png.flaticon.com/128/7887/7887079.png" alt="icon" style={{ height: "12px", width: "12px" }} />
                </p>
                <span>@Vach_Cana</span>
                <div class={style.dot_wrapper}>
                  <span className={style.dot}>.</span>
                </div>
                <span>1.23h</span>
              </div>
              <div>
                <img src="https://cdn-icons-png.flaticon.com/128/18557/18557107.png" alt="icon" style={{ height: "18px", width: "18px" }} />
              </div>
            </div>
            <div className={style.message_content}>
              <p>ARTISTIC RESIDENCY LIVE SESSION We bring the vibes you need Loading in progress… . Follow. Message. MADD's profile picture.</p>
              <img src="https://images.unsplash.com/photo-1745800227130-f61ca9d6bcb1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyNXx8fGVufDB8fHx8fA%3D%3D" />
            </div>

            <div className={style.message_actions}>
              <div className={style.message_icons}>
                <span className={style.icon_image}>
                  <img src="https://cdn-icons-png.flaticon.com/128/16689/16689811.png" alt="icon" /> <span>123</span>
                </span>
                <span className={style.icon_image}>
                  <img src="https://cdn-icons-png.flaticon.com/128/13951/13951393.png" alt="icon" /> <span>50</span>
                </span>
                <span className={style.icon_image}>
                  <img src="https://cdn-icons-png.flaticon.com/128/17217/17217096.png" alt="icon" /> <span>2217</span>
                </span>
                <span className={style.icon_image}>
                  <img src="https://cdn-icons-png.flaticon.com/128/18166/18166719.png" alt="icon" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
