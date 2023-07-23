import React, { Fragment, useState, useEffect } from 'react';
import { Card, Grid, Title, BarChart, Button } from "@tremor/react";
import { Dialog, Transition } from "@headlessui/react";
import { ArrowsExpandIcon, XIcon } from "@heroicons/react/outline";

const data2c = require('../../data/data2c.json');
const predefinedColors = [
  "red",
  "lime",
  "indigo",
  "orange",
  "teal",
  "violet",
  "amber",
  "cyan",
  "pink",
  "green",
  "sky",
  "purple",
  "emerald",
  "blue",
  "rose",
  "slate",
  "yellow",
  "fuchsia"
];

const dataByPI = data2c.reduce((groups, row) => {
  const pi = row.pi;
  if (!groups[pi]) {
    groups[pi] = [];
  }
  groups[pi].push(row);
  return groups;
}, {});

const CustomBarChart3 = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [genomeColors, setGenomeColors] = useState({});

  useEffect(() => {
    const genomeNames = [...new Set(data2c.map(item => item.genome))];
    const genomeColorMapping = genomeNames.reduce((acc, genome, index) => {
      acc[genome] = predefinedColors[index % predefinedColors.length];  // Loop back to start if there are more genomes than colors
      return acc;
    }, {});
    setGenomeColors(genomeColorMapping);
  }, []);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <div className='flex flex-col space-y-4'>
      <div className='flex justify-between space-x-2'>
        {Object.entries(dataByPI)
          // limit to first 3 PIs when the modal is closed
          .slice(0, isOpen ? undefined : 3)
          .map(([pi, rows]) => {
            const chartData = rows.reduce((result, row) => {
              const projectIndex = result.findIndex(item => item.name === row.project);

              if (projectIndex !== -1) {
                result[projectIndex][row.genome] = row.sample_count;
              } else {
                result.push({
                  name: row.project,
                  [row.genome]: row.sample_count
                });
              }

              return result;
            }, []);

            const colors = Object.values(genomeColors);

            return (
              <Card key={pi}>
                <Title>{pi}</Title>
                <BarChart
                  className='h-[91%]'
                  data={chartData}
                  index="name"
                  categories={Object.keys(genomeColors)}
                  colors={colors}
                  yAxisWidth={48}
                  showLegend={false}
                  showXAxis={false}
                  stack={true}
                />
              </Card>
            );
          })}
      </div>
      <Button
        icon={ArrowsExpandIcon}
        className="bg-gray-700 text-white hover:bg-gray-500 border-none mx-auto"
        onClick={openModal}
      >
        Show more
      </Button>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="fixed inset-0 z-10 overflow-y-auto" onClose={closeModal}>
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </Transition.Child>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <div className="inline-block align-bottom bg-white rounded-sm text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle max-w-[90vw] w-full">
                <div className="bg-white p-10 overflow-y-auto h-[85vh] mx-auto max-w-full">

                  <Grid numItems={4} className="gap-4">
                    {Object.entries(dataByPI).map(([pi, rows]) => {
                      const chartData = rows.reduce((result, row) => {
                        const projectIndex = result.findIndex(item => item.name === row.project);

                        if (projectIndex !== -1) {
                          result[projectIndex][row.genome] = row.sample_count;
                        } else {
                          result.push({
                            name: row.project,
                            [row.genome]: row.sample_count
                          });
                        }

                        return result;
                      }, []);

                      const colors = Object.values(genomeColors);

                      return (
                        <Card key={pi}>
                          <Title>{pi}</Title>
                          <BarChart
                            data={chartData}
                            index="name"
                            categories={Object.keys(genomeColors)}
                            colors={colors}
                            yAxisWidth={48}
                            showLegend={false}
                            stack={true}
                            showXAxis={false}
                          />
                        </Card>
                      );
                    })}


                  </Grid>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <Button icon={XIcon} className="bg-gray-700 text-white hover:bg-gray-500 border-none mx-auto" onClick={closeModal}>
                    Go back
                  </Button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default CustomBarChart3;
