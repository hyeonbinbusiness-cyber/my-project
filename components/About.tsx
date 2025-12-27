import React from 'react';

const About: React.FC = () => {
  return (
    <section id="about" className="py-32 px-6 relative">
      {/* Ambient background element */}
      <div className="absolute right-0 top-1/4 w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="bg-white/10 backdrop-blur-2xl border border-gray-700/50 rounded-3xl p-8 md:p-16 shadow-2xl">
            <div className="flex flex-col md:flex-row gap-12">
                <div className="flex-1">
                    <p className="text-aflow-accent font-mono mb-6 uppercase tracking-widest text-sm">About aflow</p>
                    <p className="text-3xl md:text-4xl leading-tight font-light text-white">
                    I am a motion designer obsessed with the <span className="font-bold text-white">rhythm</span> between frames. 
                    Currently based in Seoul, I help brands communicate through kinetic typography and 
                    abstract simulation.
                    </p>
                </div>
                
                <div className="md:w-1/3 flex flex-col gap-8">
                          <div className="bg-white/10 p-6 rounded-xl border border-gray-700/50 hover:border-aflow-accent/30 transition-colors">
                              <h4 className="text-aflow-accent text-xs font-mono uppercase mb-4 tracking-wider">Services</h4>
                              <ul className="space-y-2 text-sm text-gray-300">
                                  <li>Motion Graphics</li>
                                  <li>2D Generalist</li>
                                  <li>Art Direction</li>
                              </ul>
                          </div>
                    <div className="bg-white/10 p-6 rounded-xl border border-gray-700/50 hover:border-aflow-accent/30 transition-colors">
                        <h4 className="text-aflow-accent text-xs font-mono uppercase mb-4 tracking-wider">Tools</h4>
                        <ul className="space-y-2 text-sm text-gray-300">
                            <li>After Effects</li>
                            <li>Cinema 4D</li>
                            <li>Redshift</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </section>
  );
};

export default About;