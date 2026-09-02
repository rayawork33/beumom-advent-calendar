(function(){
  const store=(k,v)=>localStorage.setItem('beumom-'+k,JSON.stringify(v));
  const read=(k,f='')=>{try{return JSON.parse(localStorage.getItem('beumom-'+k))??f}catch{return f}};
  let sound=false, audio;
  function tone(freq=520,dur=.12){if(!sound)return;try{audio=audio||new(window.AudioContext||window.webkitAudioContext)();const o=audio.createOscillator(),g=audio.createGain();o.frequency.value=freq;o.type='sine';g.gain.setValueAtTime(.035,audio.currentTime);g.gain.exponentialRampToValueAtTime(.001,audio.currentTime+dur);o.connect(g);g.connect(audio.destination);o.start();o.stop(audio.currentTime+dur)}catch{}}
  const toggle=document.createElement('button');toggle.className='sound-toggle';toggle.textContent='Sound off';toggle.setAttribute('aria-pressed','false');toggle.onclick=()=>{sound=!sound;toggle.textContent=sound?'Sound on':'Sound off';toggle.setAttribute('aria-pressed',String(sound));tone(620,.2)};document.body.append(toggle);

  const tracker=document.querySelector('.tracker');
  const story=document.createElement('section');story.className='scroll-story';story.setAttribute('aria-label','The Christmas House prepares its gifts');
  story.innerHTML=`<div class="story-sticky"><div class="story-copy"><div class="story-kicker">A small scroll story</div><h2>The house has been preparing something for you.</h2><p>December asks you to carry so much. Here, each gift settles gently into place.</p></div><div class="branch left"><i class="stem"></i>${'<i class="leaf"></i>'.repeat(5)}<i class="berry" style="left:53%;bottom:54%"></i></div><div class="branch right"><i class="stem"></i>${'<i class="leaf"></i>'.repeat(5)}<i class="berry" style="left:53%;bottom:54%"></i></div><div class="story-gifts">${[
    ['5%','0','82px','86px','#E9A45E','-14deg'],['22%','18px','76px','68px','#9FAF97','11deg'],['38%','-3px','94px','110px','#D99055','-9deg'],['56%','12px','88px','83px','#F1C580','13deg'],['74%','0','96px','105px','#65765F','-12deg']
  ].map((g,i)=>`<i class="fall-gift" style="--x:${g[0]};--y:${g[1]};--w:${g[2]};--h:${g[3]};--c:${g[4]};--rot:${g[5]};transition-delay:${i*.03}s"></i>`).join('')}</div><img class="story-fox" src="./hero-fox.webp" alt="Ray the fox resting beside the gifts"><div class="story-finale">Twenty-four small gifts of care</div></div>`;
  tracker.parentNode.insertBefore(story,tracker);
  function storyProgress(){const r=story.getBoundingClientRect(),range=story.offsetHeight-innerHeight;story.style.setProperty('--story',Math.max(0,Math.min(1,-r.top/Math.max(1,range))).toFixed(3))}
  addEventListener('scroll',storyProgress,{passive:true});storyProgress();

  const intros=[
    'Pull the ribbon. This first gift belongs only to you.','Move one thing out of today. It is allowed to wait.','Make a tiny cup of comfort, one ingredient at a time.','Shake the snow globe, then let peace settle.','Light the tangled strand. Nothing needs to be perfectly straight.','Write a few lines to the woman who got you here.','Choose a quiet place. Sixty seconds is enough.','Help Ray choose what comfort looks like today.','Wipe away the frost. Enough is already here.','Choose the envelope that meets you where you are.','A very small, very unserious dance break.','Build a bouquet for yourself or someone you love.','No winning required. Recognition is the whole game.','Connect a few stars and notice one small wonder.','Make something imperfect and entirely yours.','Spin once. Let the answer be simple.','Create a kindness token to give away.','Take ten minutes. Your pace is the right pace.','Leave yourself one true, encouraging sentence.','Crooked tape is part of the design.','Open the boxes slowly. Wonder is hiding in small places.','One light. One minute. Nothing else.','Practice accepting what is freely offered.','The house remembers what you brought with you.'
  ];
  const support={overwhelmed:'You do not have to solve the whole month today.',tired:'Rest is not a reward. It is part of being alive.',lonely:'Your need for closeness is human, not inconvenient.',courage:'You can take the next small step without seeing the whole path.'};
  function area(html){return `<div class="experience stg" style="animation-delay:.44s"><p class="experience-intro">${intros[current-1]}</p><div class="activity" id="activity">${html}</div><button class="action secondary" id="skip">Not today</button></div>`}
  let current=1,timer;
  function reveal(text){activity.innerHTML=`<div class="reveal">${text}</div>`;tone(640,.18)}
  function render(n){
    const saved=read('day-'+n,'');
    const pick=(items)=>`<div class="choices">${items.map(x=>`<button class="choice" data-v="${x}">${x}</button>`).join('')}</div><div id="result" class="tiny"></div>`;
    const views={
      1:`<button class="ribbon-box" aria-label="Open the gift"></button><textarea class="field" rows="2" placeholder="One wish that is only for me…">${saved}</textarea><button class="action" data-save>Keep my wish</button>`,
      2:pick(['Perfect decorations','One more errand','Replying tonight','Doing it all myself']),
      3:`<div class="mug">☕</div>${pick(['Cocoa','Cinnamon','Orange','Marshmallow'])}<button class="action" data-stir>Stir slowly</button>`,
      4:`<button class="globe" aria-label="Shake the snow globe">🔮</button><div class="tiny">Tap, then watch it settle.</div>`,
      5:`<div class="lights">${Array(7).fill('<button class="bulb" aria-label="Light a bulb"></button>').join('')}</div><div class="tiny">One light at a time.</div>`,
      6:`<textarea class="field" rows="4" placeholder="Dear me…">${saved}</textarea><button class="action" data-save>Seal the letter</button>`,
      7:`${pick(['Fireplace','Snowfall','Rain','Silence'])}<button class="action" data-timer>Begin one minute</button>`,
      8:`<div class="dance">🦊</div>${pick(['Blanket','Warm socks','Tea','Quiet'])}`,
      9:`<button class="mirror">Tap to clear the frost</button><textarea class="field" rows="2" placeholder="One true thing about me…">${saved}</textarea>`,
      10:pick(['overwhelmed','tired','lonely','courage']),
      11:`<div class="dance">🦊</div><button class="action" data-dance>Play a tiny beat</button>`,
      12:`<div class="bouquet">🌿</div>${pick(['🌷','🌼','🌹','🌸','🌻'])}<button class="action" data-card>Finish bouquet</button>`,
      13:`<div class="bingo">${['Reheated coffee','Forgot the tape','Hid a present too well','Wore pajamas all day','Said “good enough”','Ate the treat','Changed the plan','Asked for help','Sat down'].map(x=>`<button class="choice">${x}</button>`).join('')}</div>`,
      14:`<div class="lights">${Array(8).fill('<button class="bulb" aria-label="Connect a star"></button>').join('')}</div><div class="tiny">Connect the quiet stars.</div>`,
      15:`<div class="ornament">✦</div><div class="canvas-row">${['#E9A45E','#9FAF97','#65765F','#F7CE9B'].map(c=>`<button class="choice" data-color="${c}" style="background:${c}" aria-label="Choose color"></button>`).join('')}</div><button class="action" data-decorate>Add a little sparkle</button>`,
      16:`<div class="wheel"></div><button class="action" data-spin>Spin the permission wheel</button>`,
      17:`${pick(['A kind text','A warm drink','Ten quiet minutes','A helping hand'])}<textarea class="field" rows="2" placeholder="For someone who needs this…"></textarea>`,
      18:`<div class="walk-list">${['Something bright','Something moving','Something quiet','Something beautiful'].map(x=>`<label><input type="checkbox"> ${x}</label>`).join('')}</div><button class="action" data-walk>Start 10 minutes</button>`,
      19:`<textarea class="field" rows="3" placeholder="You are doing better than you think…">${saved}</textarea><button class="action" data-save>Keep this note</button>`,
      20:`<div class="wrap-game"></div><button class="action" data-tape>Add crooked tape</button>`,
      21:`<div class="choices">${['A tiny box','A warm box','A shining box','A quiet box'].map(x=>`<button class="choice" data-box>${x}</button>`).join('')}</div>`,
      22:`<button class="candle" aria-label="Light the candle">🕯️</button><div class="tiny">Tap the candle when you are ready.</div>`,
      23:`<div class="catcher"><button class="action" data-rain>Let kindness fall</button></div>`,
      24:`<div class="final-tree">🎄</div><div class="reveal">${read('day-1','Your first wish is still yours.')}</div><div class="faith-choice">${pick(['Christmas faith reflection','Seasonal reflection'])}</div>`
    };
    return area(views[n]);
  }
  const oldOpen=window.openDoor;
  window.openDoor=function(n,b){oldOpen(n,b);if(simDay<n)return;current=n;setTimeout(()=>{document.querySelector('.practice').style.display='none';document.querySelector('.gift').style.display='none';document.querySelector('.card-body').insertAdjacentHTML('beforeend',render(n));wire(n)},20)};
  function wire(n){
    const a=document.getElementById('activity');window.activity=a;document.getElementById('skip').onclick=()=>reveal('That is completely enough for today.');
    a.querySelectorAll('.choice').forEach(c=>c.onclick=()=>{c.classList.toggle('on');tone(470,.08);const v=c.dataset.v;if(n===2){c.classList.add('task-chip','gone');setTimeout(()=>reveal('One less thing to carry today.'),500)}if(n===3)c.parentElement.previousElementSibling?.classList.add('stir');if(n===8)document.getElementById('result').textContent='Ray approves this comfort plan.';if(n===10&&v)reveal(support[v]);if(n===12){document.querySelector('.bouquet').textContent+=c.textContent}if(n===17)document.querySelector('.field').value=`I’m giving you: ${c.textContent}.`;if(n===24)reveal(v.startsWith('Christmas')?'May the hope, peace, joy and love of Christmas meet you gently. You are allowed to receive grace.':'May light, rest, kindness and connection meet you gently. You are allowed to receive care.')});
    a.querySelector('[data-save]')?.addEventListener('click',()=>{const v=a.querySelector('.field').value.trim();store('day-'+n,v);reveal(n===6?'Your letter is sealed until Day 24.':'Saved quietly on this device.')});
    a.querySelector('.ribbon-box')?.addEventListener('click',e=>{e.currentTarget.classList.add('open');tone(600,.2)});
    a.querySelector('[data-stir]')?.addEventListener('click',()=>{a.querySelector('.mug').classList.add('stir');setTimeout(()=>reveal('Warmth, made for you.'),700)});
    a.querySelector('.globe')?.addEventListener('click',e=>{e.currentTarget.classList.add('slow');setTimeout(()=>reveal('Peace can arrive slowly.'),1700)});
    a.querySelectorAll('.bulb').forEach((x,i,all)=>x.onclick=()=>{x.classList.add('on');tone(460+i*35,.08);if([...all].every(y=>y.classList.contains('on')))setTimeout(()=>reveal(n===14?'Look up. Wonder is still here.':'Tangled can still be beautiful.'),300)});
    a.querySelector('[data-timer]')?.addEventListener('click',e=>startTimer(e.currentTarget,60));
    a.querySelector('.mirror')?.addEventListener('click',()=>reveal('You are enough before anything else gets finished.'));
    a.querySelector('[data-dance]')?.addEventListener('click',()=>{a.querySelector('.dance').classList.toggle('go');for(let i=0;i<5;i++)setTimeout(()=>tone(300+i*70,.08),i*180)});
    a.querySelector('[data-card]')?.addEventListener('click',()=>reveal('A little beauty, arranged by you.'));
    a.querySelectorAll('[data-color]').forEach(c=>c.onclick=()=>a.querySelector('.ornament').style.background=c.dataset.color);
    a.querySelector('[data-decorate]')?.addEventListener('click',()=>a.querySelector('.ornament').textContent+='·');
    a.querySelector('[data-spin]')?.addEventListener('click',()=>{a.querySelector('.wheel').style.transform='rotate(820deg)';setTimeout(()=>reveal('Permission: choose the easiest version.'),1250)});
    a.querySelector('[data-walk]')?.addEventListener('click',e=>startTimer(e.currentTarget,600));
    a.querySelector('[data-tape]')?.addEventListener('click',()=>{const t=document.createElement('i');t.className='tape';t.style.setProperty('--r',(-35+Math.random()*70)+'deg');t.style.setProperty('--x',(5+Math.random()*70)+'px');t.style.setProperty('--y',(5+Math.random()*65)+'px');a.querySelector('.wrap-game').append(t);tone(380,.08)});
    a.querySelectorAll('[data-box]').forEach((x,i)=>x.onclick=()=>reveal(['Notice one ordinary thing that feels good.','Remember a moment that made you laugh.','Look for the smallest source of light.','Let silence be a gift, not an absence.'][i]));
    a.querySelector('.candle')?.addEventListener('click',e=>{e.currentTarget.classList.add('lit');tone(540,.2);setTimeout(()=>reveal('One quiet light is enough.'),1200)});
    a.querySelector('[data-rain]')?.addEventListener('click',e=>{e.currentTarget.remove();['help','rest','love','kindness','time'].forEach((w,i)=>{const b=document.createElement('button');b.className='kind-word';b.textContent=w;b.style.left=(8+i*18)+'%';b.style.animationDelay=i*.25+'s';b.onclick=()=>{b.remove();tone(500+i*40,.1)};a.querySelector('.catcher').append(b)})});
  }
  function startTimer(btn,seconds){clearInterval(timer);let left=seconds;btn.outerHTML='<div class="timer-ring"><span>'+left+'</span></div>';const ring=document.querySelector('.timer-ring');timer=setInterval(()=>{left--;ring.querySelector('span').textContent=left;ring.style.setProperty('--p',((seconds-left)/seconds*100)+'%');if(left<=0){clearInterval(timer);reveal('You stayed. That was enough.')}},1000)}
  const originalClose=window.closeModal;window.closeModal=function(){clearInterval(timer);document.querySelectorAll('.experience').forEach(x=>x.remove());document.querySelector('.practice').style.display='';document.querySelector('.gift').style.display='';originalClose()};
})();
