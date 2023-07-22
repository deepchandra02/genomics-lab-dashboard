import React, { Fragment, useState } from 'react';
import { Card, Grid, Col, Title, BarChart, Button } from "@tremor/react";
import { Dialog, Transition } from "@headlessui/react";
import { ArrowsExpandIcon, XIcon } from "@heroicons/react/outline";

const data2c = require('../../data/data2c.json');

const CustomBarChart3 = () => {
  // Define available colors
  const Colors = [
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
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  // Function to format the y-axis values
  const dataFormatter = (number) => {
    return number.toString();
  };

  // Function to generate the categories array from an object
  const getCategories = (obj) => {
    let categories = [];
    for (let key in obj) {
      if (key !== 'pi') {
        categories.push(key);
      }
    }
    return categories;
  };

  // Split the data into chunks of 4 for each row
  const chunkedData = [];
  for (let i = 0; i < data2c.length; i += 4) {
    chunkedData.push(data2c.slice(i, i + 4));
  }

  return (
    <div className='flex flex-col space-y-4'>
      <div className='flex justify-between space-x-2'>
        {chunkedData[0].map((item, index) => (
          <Card key={index} className=''>
            <Title>{item.pi}</Title>
            <BarChart
              className="mt-6 h-[80%]"
              data={[item]}
              index="pi"
              categories={getCategories(item)}
              colors={Colors}
              valueFormatter={dataFormatter}
              yAxisWidth={48}
              showLegend={false}
            />
          </Card>
        ))}
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
                    {chunkedData.map((row, rowIndex) => (
                      <Col key={rowIndex} numColSpan={1}>
                        {row.map((item, index) => (
                          <Card key={index} className='m-4'>
                            <Title>{item.pi}</Title>
                            <BarChart
                              className="mt-6 h-40"
                              data={[item]}
                              index="pi"
                              categories={getCategories(item)}
                              colors={Colors}
                              valueFormatter={dataFormatter}
                              yAxisWidth={48}
                              showLegend={false}
                            />
                          </Card>
                        ))}
                      </Col>
                    ))}
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
